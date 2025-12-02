import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendWelcomeEmail } from "@/utils/resend/resend";

export async function GET(request) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	const next = requestUrl.searchParams.get("next") ?? "/";
	const origin = requestUrl.origin;

	if (!code) {
		return NextResponse.redirect(`${origin}/auth/auth-code-error`);
	}

	const pendingCookies = [];
	const supabase = await createClient((cookie) => {
		pendingCookies.push(cookie);
	});
	const { error } = await supabase.auth.exchangeCodeForSession(code);

	if (error) {
		console.error("Failed to exchange auth code for session", error);
		return NextResponse.redirect(`${origin}/auth/auth-code-error`);
	}

	const response = NextResponse.redirect(new URL(next, origin));
	pendingCookies.forEach(({ name, value, options }) => {
		response.cookies.set(name, value, options);
	});

	// send welcome email to new users
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Only send welcome email when the user was just created via Google
	try {
		const createdAt = user?.created_at
			? new Date(user.created_at).getTime()
			: 0;
		const lastSignInAt = user?.last_sign_in_at
			? new Date(user.last_sign_in_at).getTime()
			: createdAt;
		const now = Date.now();
		// consider user new if account creation happened within last 15s
		const isRecentlyCreated =
			createdAt && Math.abs(now - createdAt) < 15_000;
		const isFirstSignIn =
			createdAt &&
			lastSignInAt &&
			Math.abs(createdAt - lastSignInAt) < 5_000;
		const hasGoogleIdentity = Array.isArray(user?.identities)
			? user.identities.some((i) => i.provider === "google")
			: false;

		if (
			user?.email &&
			hasGoogleIdentity &&
			(isRecentlyCreated || isFirstSignIn)
		) {
			await sendWelcomeEmail(user.email);
		}
	} catch (err) {
		console.error("Failed to evaluate welcome-email conditions", err);
	}

	return response;
}
