import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

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
	return response;
}
