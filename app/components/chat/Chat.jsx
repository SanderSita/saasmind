"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Image } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { uploadImage } from "./actions";
import { getUser } from "@/context/UserContext";
import "katex/dist/katex.min.css";
import MessageList from "@/app/components/message-list";

export default function Chat({ project }) {
	const user = getUser();
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [isDragActive, setIsDragActive] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingMessages, setLoadingMessages] = useState(true);
	const [model, setModel] = useState("reasoning");
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);
	const fileInputRef = useRef(null);

	useEffect(() => {
		if (project?.id) loadMessages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [project?.id]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// revoke object URLs when preview changes to avoid memory leaks
	useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	// ensure we have a File object (some clipboard items may be Blob)
	const ensureFile = (blob) => {
		if (!blob) return null;
		if (blob instanceof File) return blob;
		try {
			return new File([blob], `pasted-${Date.now()}.png`, {
				type: blob.type || "image/png",
			});
		} catch (err) {
			// fallback: some environments may not support File constructor
			blob.name = `pasted-${Date.now()}.png`;
			return blob;
		}
	};

	const loadMessages = async () => {
		setLoadingMessages(true);
		try {
			const { data, error } = await supabase
				.from("chat_messages")
				.select("*")
				.eq("project_id", project.id)
				.order("created_at", { ascending: true });

			if (error) throw error;
			console.log("Loaded messages:", data);
			setMessages(data || []);
		} catch (err) {
			console.error("Error loading messages:", err);
		} finally {
			setLoadingMessages(false);
		}
	};

	const handleSend = async (e) => {
		if (!input.trim() || !user) return;

		const userMessage = input.trim();
		setInput("");
		setLoading(true);

		try {
			// If an image is selected, upload first so we can save the message with image_url
			let imageUrl = null;
			if (selectedImage) {
				// upload to supabase storage and get public url
				imageUrl = await uploadImage(selectedImage, project.id);
			}

			// Insert user message (include image_url if present) into DB for chat history
			const { data: userMsg, error: userError } = await supabase
				.from("chat_messages")
				.insert({
					project_id: project.id,
					user_id: user.id || null,
					role: "user",
					content: userMessage,
					image_url: imageUrl,
					created_at: new Date().toISOString(),
				})
				.select()
				.single();

			if (userError) throw userError;
			setMessages((prev) => [...prev, userMsg]);

			const aiResponse = await generateAIResponse(
				userMessage,
				project,
				imageUrl
			);

			const { data: aiMsg, error: aiError } = await supabase
				.from("chat_messages")
				.insert({
					project_id: project.id,
					user_id: user.id || null,
					role: "assistant",
					content: aiResponse,
					created_at: new Date().toISOString(),
				})
				.select()
				.single();

			if (aiError) throw aiError;
			setMessages((prev) => [...prev, aiMsg]);

			// clear image selection after send
			setSelectedImage(null);
			setPreviewUrl(null);
			if (fileInputRef.current) fileInputRef.current.value = "";
		} catch (err) {
			console.error("Error sending message:", err);
		} finally {
			setLoading(false);
		}
	};

	const generateAIResponse = async (message, project, imageUrl = null) => {
		let formattedMessages = messages.map((msg) => ({
			role: msg.role,
			content: msg.content,
		}));

		// If we have an image, send the last user message as structured content
		if (imageUrl) {
			formattedMessages.push({
				role: "user",
				content: [
					{ type: "text", text: message },
					{ type: "image_url", image_url: { url: imageUrl } },
				],
			});
		} else {
			formattedMessages.push({ role: "user", content: message });
		}

		const res = await fetch("/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				messages: formattedMessages,
				project,
				model:
					model === "web_search"
						? "groq/compound"
						: "openai/gpt-oss-120b",
			}),
		});

		if (!res.ok) {
			throw new Error("Failed to generate AI response");
		}

		const { response } = await res.json();
		return response;
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend(e);
		}
	};

	// Handle paste (Ctrl+V) for images when focus is in the input
	const handlePaste = (e) => {
		try {
			const items = e.clipboardData?.items;
			if (!items) return;
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				if (item.kind === "file" && item.type.startsWith("image/")) {
					const blob = item.getAsFile();
					const file = ensureFile(blob);
					if (file) {
						setSelectedImage(file);
						setPreviewUrl(URL.createObjectURL(file));
						// clear the native file input so same file can be selected later
						if (fileInputRef.current)
							fileInputRef.current.value = "";
						// prevent the pasted image from inserting into the text input
						e.preventDefault();
						break;
					}
				}
			}
		} catch (err) {
			console.error("Error handling paste:", err);
		}
	};

	// Drag & drop handlers
	const handleDragEnter = (e) => {
		e.preventDefault();
		setIsDragActive(true);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragActive(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		setIsDragActive(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragActive(false);
		try {
			const files = e.dataTransfer?.files;
			if (files && files.length > 0) {
				const file = files[0];
				if (file.type && file.type.startsWith("image/")) {
					const f = ensureFile(file);
					setSelectedImage(f);
					setPreviewUrl(URL.createObjectURL(f));
					if (fileInputRef.current) fileInputRef.current.value = "";
				}
			}
		} catch (err) {
			console.error("Error handling drop:", err);
		}
	};

	// When loading finishes (response shown), restore focus to the input.
	useEffect(() => {
		if (!loading) {
			// schedule focus on next tick so DOM has updated and input is enabled
			setTimeout(() => inputRef.current?.focus(), 0);
		}
	}, [loading]);

	return (
		// let parent control the height; allow intern</div>al scrolling with min-h-0 so flex children can overflow
		<div className="flex-1 flex flex-col min-h-0">
			<header className="bg-white border-b border-slate-200 px-6 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-slate-900">
							{project.name}
						</h1>
						<p className="text-slate-600 text-sm">
							{project.description
								? project.description.slice(0, 100) + "..."
								: "No description"}
						</p>
					</div>
					<span
						className={`px-3 py-1 rounded-full text-sm font-medium ${
							project.status === "idea"
								? "bg-blue-100 text-blue-700"
								: project.status === "development"
								? "bg-amber-100 text-amber-700"
								: "bg-emerald-100 text-emerald-700"
						}`}
					>
						{project.status}
					</span>
				</div>
			</header>

			<div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-8">
				{loadingMessages ? (
					<div className="flex items-center justify-center h-full">
						<Sparkles className="w-8 h-8 text-slate-400 animate-pulse" />
					</div>
				) : messages.length === 0 ? (
					<div className="flex items-center justify-center h-full">
						<div className="text-center max-w-md">
							<Sparkles className="w-16 h-16 text-slate-300 mx-auto mb-4" />
							<h3 className="text-xl font-bold text-slate-900 mb-2">
								Start the conversation
							</h3>
							<p className="text-slate-600 mb-6">
								Ask me anything about building, marketing, or
								growing {project.name}. I remember all our
								previous conversations!
							</p>
							<div className="bg-white rounded-xl p-4 border border-slate-200 text-left space-y-2">
								<p className="text-sm font-medium text-slate-900">
									Try asking:
								</p>
								<button
									onClick={() =>
										setInput(
											"Help me create a marketing strategy"
										)
									}
									className="cursor-pointer block w-full text-left text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors"
								>
									"Help me create a marketing strategy"
								</button>
								<button
									onClick={() =>
										setInput(
											"What features should I build first?"
										)
									}
									className="cursor-pointer block w-full text-left text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors"
								>
									"What features should I build first?"
								</button>
								<button
									onClick={() =>
										setInput(
											"Generate social media post ideas"
										)
									}
									className="cursor-pointer block w-full text-left text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors"
								>
									"Generate social media post ideas"
								</button>
							</div>
						</div>
					</div>
				) : (
					<MessageList
						messages={messages}
						loading={loading}
						endRef={messagesEndRef}
					/>
				)}
			</div>

			<div className="bg-white border-t border-slate-200 px-6 py-4">
				<div className="max-w-4xl mx-auto">
					<div
						className={`flex gap-3 items-center ${
							isDragActive
								? "ring-2 ring-slate-400/40 rounded-xl"
								: ""
						}`}
						onDragEnter={handleDragEnter}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
					>
						{/* Model selector (left of input) - styled to match shadcn look */}
						<select
							value={model}
							onChange={(e) => setModel(e.target.value)}
							className="shrink-0 w-44 px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-slate-900/10 outline-none"
						>
							<option value="reasoning">Reasoning</option>
							<option value="web_search">Web Search</option>
						</select>
						{/* Image picker */}
						<div className="shrink-0">
							<input
								type="file"
								accept="image/*"
								id="chat-image-input"
								ref={fileInputRef}
								className="hidden"
								onChange={async (e) => {
									const file = e.target.files?.[0] ?? null;
									if (!file) return;
									setSelectedImage(file);
									const url = URL.createObjectURL(file);
									setPreviewUrl(url);
								}}
							/>
							<label
								htmlFor="chat-image-input"
								className="cursor-pointer p-2 rounded-lg hover:bg-slate-100"
							>
								<Image className="w-5 h-5 text-slate-600" />
							</label>
						</div>
						{/* Preview */}
						{previewUrl && (
							<div className="shrink-0 relative">
								<img
									src={previewUrl}
									alt="preview"
									className="w-12 h-12 rounded-md object-cover border"
								/>
								<button
									onClick={() => {
										setSelectedImage(null);
										setPreviewUrl(null);
										if (fileInputRef.current)
											fileInputRef.current.value = "";
									}}
									className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow"
								>
									<span className="text-xs">✕</span>
								</button>
							</div>
						)}
						<input
							ref={inputRef}
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyPress}
							onPaste={handlePaste}
							disabled={loading}
							placeholder="Ask me anything about your SaaS..."
							className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all disabled:opacity-50"
						/>
						<button
							onClick={handleSend}
							disabled={loading || !input.trim()}
							className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all font-medium shadow-lg shadow-slate-900/10 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							<Send className="w-5 h-5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
