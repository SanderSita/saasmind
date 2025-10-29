import { Groq } from "groq-sdk";

export async function generateGroqChatCompletion(messages, project) {
	const groq = new Groq({
		apiKey: process.env["NEXT_PUBLIC_GROQ_API_KEY"],
	});

	// --- ⚖️ Size Guard: pre-check total length ---
	const totalLength = addProjectContextToMessages(messages, project).reduce(
		(sum, msg) => sum + msg.content.length,
		0
	);

	const MAX_SAFE_LENGTH = 20000; // adjust based on token limit / safety margin

	if (totalLength > MAX_SAFE_LENGTH) {
		console.warn("Messages too long — summarizing before first request...");

		// Only summarize a compact subset (last 3 messages)
		const msgsToSummarize =
			messages.length > 4 ? messages.slice(-3) : messages;

		const summaryResponse = await groq.chat.completions.create({
			messages: [
				{
					role: "user",
					content: `Summarize the following conversation:\n${msgsToSummarize
						.map((msg) => `${msg.role}: ${msg.content}`)
						.join("\n")}`,
				},
			],
			model: "openai/gpt-oss-120b",
			temperature: 1,
			max_completion_tokens: 2048,
			top_p: 1,
			stream: false,
			reasoning_effort: "medium",
		});

		const summaryText =
			summaryResponse?.choices?.[0]?.message?.content ?? "(no summary)";

		messages = [
			{
				role: "user",
				content: `Summary of previous conversation: ${summaryText}`,
			},
			messages[messages.length - 1], // last user message
		];
	}

	let chatCompletion;

	try {
		messages = addProjectContextToMessages(messages, project);
		chatCompletion = await groq.chat.completions.create({
			messages,
			model: "openai/gpt-oss-120b",
			temperature: 1,
			max_completion_tokens: 8192,
			top_p: 1,
			stream: true,
			reasoning_effort: "medium",
			stop: null,
		});
	} catch (err) {
		// --- 🧩 Handle 413 payload too large error ---
		console.error("Error generating Groq chat completion:", err);
	}

	// --- 🧠 Handle stream or standard completion ---
	if (chatCompletion && typeof chatCompletion.iterator === "function") {
		return getTextFromChatCompletion(chatCompletion);
	}

	if (chatCompletion?.choices?.[0]?.message?.content) {
		return chatCompletion.choices[0].message.content;
	}

	return "";
}

// --- 🧾 Stream reader helper ---
async function getTextFromChatCompletion(chatCompletion) {
	let text = "";
	try {
		for await (const chunk of chatCompletion.iterator()) {
			if (typeof chunk === "string") {
				text += chunk;
			} else if (chunk && Array.isArray(chunk.choices)) {
				for (const choice of chunk.choices) {
					if (choice.delta?.content) text += choice.delta.content;
					else if (choice.message?.content)
						text += choice.message.content;
					else if (choice.content) text += choice.content;
				}
			} else if (chunk?.content) {
				text += chunk.content;
			}
		}
	} catch (err) {
		console.error("Error reading stream:", err);
	}
	return text;
}

function addProjectContextToMessages(messages, project) {
	return [
		{
			role: "user",
			content: `<context> project name: ${project.name}, project description: ${project.description}, project status: ${project.status}, target market: ${project.target_market} </context>`,
		},
		...messages,
	];
}
