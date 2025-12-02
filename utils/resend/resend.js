import fs from "fs/promises";
import path from "path";
import { Resend } from "resend";

const resend = new Resend(process.env.EMAIL_API_KEY);

export async function sendWelcomeEmail(toEmail) {
	// Resolve the welcome template path relative to the project root
	const templatePath = path.join(process.cwd(), "emails", "welcome.html");

	let html = "";
	try {
		html = await fs.readFile(templatePath, "utf8");
	} catch (err) {
		// If reading the file fails, fallback to a minimal HTML body
		console.error("Failed to load welcome template:", err);
		html = `<html><body><p>Welcome to SaaSminder!</p></body></html>`;
	}

	return await resend.emails.send({
		from: "SaaSminder <info@saasminder.com>",
		to: [toEmail],
		subject: "Welcome to SaaSminder!",
		html,
	});
}
