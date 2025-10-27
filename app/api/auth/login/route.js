// login route
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
	const { email, password } = await req.json();

	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return new Response(error.message, { status: 401 });
	}

	return new Response("Login successful", { status: 200 });
}
