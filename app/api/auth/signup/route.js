import { createClient } from "@/utils/supabase/server";
import { sendWelcomeEmail } from "@/utils/resend/resend";

export async function POST(req) {
	const { email, password } = await req.json();

	const supabase = await createClient();
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		return new Response(error.message, { status: 401 });
	}

	// create user profile in the database
	const { error: profileError } = await supabase
		.from("users")
		.insert([{ auth_id: data.user.id, email: data.user.email }]);

	if (profileError) {
		return new Response(profileError.message, { status: 500 });
	}

	// send welcome email
	await sendWelcomeEmail(data.user.email);

	return new Response("Signup successful", { status: 200 });
}
