import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Bot, User, FastForward, Copy, Check } from "lucide-react";

function preprocessLaTeX(content) {
	return content
		.replace(/\\\[(.*?)\\\]/gs, (_, eq) => `$$${eq}$$`)
		.replace(/\\\((.*?)\\\)/gs, (_, eq) => `$${eq}$`);
}

function CodeBlock({ children, ...props }) {
	const [copied, setCopied] = useState(false);
	const preRef = useRef(null);

	const handleCopy = async () => {
		const text = preRef.current?.innerText ?? "";
		if (!text) return;

		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(text);
			} else {
				// fallback
				const ta = document.createElement("textarea");
				ta.value = text;
				document.body.appendChild(ta);
				ta.select();
				document.execCommand("copy");
				document.body.removeChild(ta);
			}

			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (e) {
			// ignore failures silently for now
		}
	};

	return (
		<div className="relative mb-4 group">
			<button
				onClick={handleCopy}
				title={copied ? "Copied" : "Copy code"}
				aria-pressed={copied}
				className="absolute cursor-pointer top-2 right-2 z-10 px-2 py-1 rounded bg-white/90 hover:bg-white transition border border-slate-200 shadow-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
			>
				{copied ? (
					<>
						<Check className="w-4 h-4 text-slate-700" />
						<span className="text-sm text-slate-700">Copied</span>
					</>
				) : (
					<>
						<Copy className="w-4 h-4 text-slate-700" />
						<span className="text-sm text-slate-700">Copy</span>
					</>
				)}
			</button>

			<pre
				ref={preRef}
				className="bg-slate-100 p-4 rounded-lg overflow-x-auto"
				{...props}
			>
				{children}
			</pre>
		</div>
	);
}

const Message = React.memo(({ message, isLast, shouldAnimate }) => {
	const [displayedText, setDisplayedText] = useState(
		shouldAnimate ? "" : message.content
	);
	const [isTyping, setIsTyping] = useState(shouldAnimate);
	// rafRef: stores the current requestAnimationFrame id
	const rafRef = useRef(null);
	// last timestamp (ms) used to calculate elapsed time between frames
	const lastTimeRef = useRef(null);
	// accumulated time since last char was emitted (ms)
	const accRef = useRef(0);
	// current index into the message content
	const indexRef = useRef(0);

	useEffect(() => {
		// Use a requestAnimationFrame loop and an elapsed-time accumulator
		// to decide how many characters to append per animation frame. This
		// avoids calling setState for every single character at very small
		// intervals (which can lead to dropped/skipped characters), while
		// preserving high typing speed.
		if (shouldAnimate && message.role === "assistant") {
			setDisplayedText("");
			setIsTyping(true);
			const text = message.content ?? "";

			// ms per character target. Tune this value to make typing faster/slower.
			const charInterval = 3; // ~3ms per character (keeps behavior similar)

			indexRef.current = 0;
			accRef.current = 0;
			lastTimeRef.current = performance.now();

			const step = (now) => {
				const elapsed = now - (lastTimeRef.current ?? now);
				lastTimeRef.current = now;
				accRef.current += elapsed;

				// determine how many characters we should advance given accumulated time
				const advance = Math.floor(accRef.current / charInterval);
				if (advance > 0) {
					indexRef.current = Math.min(
						text.length,
						indexRef.current + advance
					);
					// keep remainder of accumulated time
					accRef.current = accRef.current % charInterval;
					// update state once per frame with the new substring
					setDisplayedText(text.slice(0, indexRef.current));
				}

				if (indexRef.current < text.length) {
					rafRef.current = requestAnimationFrame(step);
				} else {
					// finished
					setIsTyping(false);
					rafRef.current = null;
				}
			};

			rafRef.current = requestAnimationFrame(step);

			return () => {
				if (rafRef.current) cancelAnimationFrame(rafRef.current);
			};
		} else {
			// Not animating: render whole content immediately
			setDisplayedText(message.content ?? "");
			setIsTyping(false);
		}
	}, [shouldAnimate, message]);

	const handleSkip = () => {
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
		setDisplayedText(message.content ?? "");
		setIsTyping(false);
	};

	return (
		<div
			className={`flex gap-4 ${
				message.role === "user" ? "justify-end" : "justify-start"
			}`}
		>
			{/* {message.role === "assistant" && (
				<div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
					<Bot className="w-5 h-5 text-white" />
				</div>
			)} */}
			<div
				className={`relative px-6 py-4 rounded-2xl ${
					message.role === "user"
						? "bg-slate-900 text-white"
						: " text-slate-900"
				}`}
			>
				{/* Image (if provided) */}
				{message.image_url && (
					<div className="mb-4 max-w-2xs">
						<a
							href={message.image_url}
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src={message.image_url}
								alt="attachment"
								className="rounded-md border-2 max-w-full h-auto object-contain"
							/>
						</a>
					</div>
				)}
				<div className="max-w-[calc(100vw-50px)] overflow-x-auto">
					<ReactMarkdown
						remarkPlugins={[remarkGfm, remarkMath]}
						rehypePlugins={[rehypeKatex]}
						components={{
							table: ({ node, ...props }) => (
								<div className="overflow-x-auto mb-4">
									<table
										className="table-auto w-full mb-4 max-w-[calc(100vw-50px)] overflow-x-auto"
										{...props}
									/>
								</div>
							),
							p: ({ node, ...props }) => (
								<p className="custom-paragraph" {...props} />
							),
							thead: ({ node, ...props }) => (
								<thead className="text-left" {...props} />
							),
							hr: ({ node, ...props }) => (
								<hr className="my-10" {...props} />
							),
							pre: ({ node, children, ...props }) => (
								<CodeBlock {...props}>{children}</CodeBlock>
							),
							code: ({ node, ...props }) => (
								<code
									className="bg-slate-100 p-1 rounded"
									{...props}
								/>
							),
							h3: ({ node, ...props }) => (
								<h3 className="text-xl mb-4 mt-6" {...props} />
							),
							h2: ({ node, ...props }) => (
								<h2 className="text-2xl mb-4 mt-6" {...props} />
							),
							td: ({ node, ...props }) => (
								<td className="p-2" {...props} />
							),
							ol: ({ node, ...props }) => (
								<ol
									className="ml-5 mb-4 list-decimal"
									{...props}
								/>
							),
							ul: ({ node, ...props }) => (
								<ul
									className="ml-5 mb-4 list-disc"
									{...props}
								/>
							),
							li: ({ node, ...props }) => (
								<li className="ml-5" {...props} />
							),
							input: ({ node, ...props }) => {
								if (props.type === "checkbox") {
									return (
										<input
											className="mr-2"
											type="checkbox"
											checked={props.checked}
											readOnly
										/>
									);
								}
								return <input {...props} />;
							},
						}}
					>
						{preprocessLaTeX(displayedText)}
					</ReactMarkdown>
				</div>

				{/* Time */}
				<p
					className={`text-xs mt-2 ${
						message.role === "user"
							? "text-slate-400"
							: "text-slate-500"
					}`}
				>
					{new Date(message.created_at).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</p>

				{/* Skip button */}
				{isTyping && (
					<button
						onClick={handleSkip}
						className="absolute top-2 right-2 p-1 rounded-full bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
						title="Skip typing"
					>
						<FastForward className="w-4 h-4 text-slate-600" />
					</button>
				)}
			</div>
		</div>
	);
});

const MessageList = React.memo(({ messages, loading, endRef }) => {
	const prevMessageCount = useRef(messages.length);

	// Detect if a new assistant message was added
	const shouldAnimateLast =
		messages.length > prevMessageCount.current &&
		messages[messages.length - 1].role === "assistant";

	useEffect(() => {
		prevMessageCount.current = messages.length;
	}, [messages.length]);

	return (
		<div className="max-w-5xl mx-auto space-y-6">
			{messages.map((m, i) => (
				<Message
					key={m.id}
					message={m}
					isLast={i === messages.length - 1}
					shouldAnimate={
						shouldAnimateLast && i === messages.length - 1
					}
				/>
			))}
			{loading && (
				<div className="flex gap-4 justify-start">
					{/* <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
						<Bot className="w-5 h-5 text-white" />
					</div> */}
					<div className="max-w-2xl px-6 py-4 rounded-2xl bg-white border border-slate-200">
						<div className="flex gap-2">
							<div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
							<div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
							<div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
						</div>
					</div>
				</div>
			)}
			<div ref={endRef} />
		</div>
	);
});

export default MessageList;
