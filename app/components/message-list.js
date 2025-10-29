// MessageList.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Bot, User } from "lucide-react";

function preprocessLaTeX(content) {
	return content
		.replace(/\\\[(.*?)\\\]/gs, (_, eq) => `$$${eq}$$`)
		.replace(/\\\((.*?)\\\)/gs, (_, eq) => `$${eq}$`);
}

const Message = React.memo(({ message }) => (
	<div
		className={`flex gap-4 ${
			message.role === "user" ? "justify-end" : "justify-start"
		}`}
	>
		{message.role === "assistant" && (
			<div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
				<Bot className="w-5 h-5 text-white" />
			</div>
		)}
		<div
			className={`max-w-2xl px-6 py-4 rounded-2xl ${
				message.role === "user"
					? "bg-slate-900 text-white"
					: "bg-white border border-slate-200 text-slate-900"
			}`}
		>
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
						pre: ({ node, ...props }) => (
							<pre
								className="bg-slate-100 p-4 rounded-lg overflow-x-auto mb-4"
								{...props}
							/>
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
							<ol className="ml-5 mb-4 list-decimal" {...props} />
						),
						ul: ({ node, ...props }) => (
							<ul className="ml-5 mb-4 list-disc" {...props} />
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
					{preprocessLaTeX(message.content)}
				</ReactMarkdown>
			</div>
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
		</div>
		{message.role === "user" && (
			<div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
				<User className="w-5 h-5 text-slate-700" />
			</div>
		)}
	</div>
));

const MessageList = React.memo(({ messages, loading, endRef }) => (
	<div className="max-w-5xl mx-auto space-y-6">
		{messages.map((m) => (
			<Message key={m.id} message={m} />
		))}
		{loading && (
			<div className="flex gap-4 justify-start">
				<div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
					<Bot className="w-5 h-5 text-white" />
				</div>
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
));

export default MessageList;
