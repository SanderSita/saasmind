import { generateGroqChatCompletion } from "@/utils/groq/groq";

export async function POST(request) {
	const { messages, project, model } = await request.json();

	const result = await generateGroqChatCompletion(messages, project, model);

	// Normalize response to include text and optional meta fields
	if (result && typeof result === "object") {
		return new Response(
			JSON.stringify({
				response: result.text ?? "",
				meta: {
					reasoning: result.reasoning ?? null,
					executed_tools: result.executed_tools ?? null,
					raw: result.raw ?? null,
				},
			})
		);
	}

	return new Response(JSON.stringify({ response: result }));
}
