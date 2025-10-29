import { generateGroqChatCompletion } from "@/utils/groq/groq";

export async function POST(request) {
	const { messages, project } = await request.json();

	const response = await generateGroqChatCompletion(messages, project);

	return new Response(JSON.stringify({ response }));
}
