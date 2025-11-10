import { generateGroqChatCompletion } from "@/utils/groq/groq";

export async function POST(request) {
	try {
		const { messages, project, model } = await request.json();

		// Append a short-prompt to request a concise title
		const prompt = {
			role: "user",
			content:
				"Provide a concise title (6 words max) that summarizes this conversation. Return only the title, no extra commentary. Default to 'Untitled Chat' if unable to generate a title. Dont mention that it's a title.",
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
