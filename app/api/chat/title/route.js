import { generateGroqChatCompletion } from "@/utils/groq/groq";

export async function POST(request) {
	try {
		const { messages, project, model } = await request.json();

		// Append a short-prompt to request a concise title
		const prompt = {
			role: "user",
			content:
				"You are a clever, concise naming assistant. Given the user’s first message below, invent a short, catchy name for this conversation. The name should be 2‑5 words long, title‑cased, and must capture the main intent or topic of the message.  Return **only the name** – no quotes, no punctuation other than normal title caps, no extra whitespace.",
		};

		const msgs = [...(messages || []), prompt];

		const result = await generateGroqChatCompletion(
			msgs,
			project,
			model || "groq/compound"
		);

		const title = (result?.text || "").trim();

		return new Response(JSON.stringify({ title }), { status: 200 });
	} catch (err) {
		console.error("Error in /api/chat/title:", err);
		return new Response(JSON.stringify({ title: null }), { status: 500 });
	}
}
