"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Image } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { uploadImage } from "./actions";
import { useUser } from "@/context/UserContext";
import "katex/dist/katex.min.css";
import MessageList from "@/app/components/message-list";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Chat({ project, selectedChat, onChatSaved }) {
	const user = useUser();
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [fileName, setFileName] = useState("");
	const [fileSize, setFileSize] = useState("");
	const [isDragActive, setIsDragActive] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingMessages, setLoadingMessages] = useState(true);
	const [model, setModel] = useState("reasoning");
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);
	const fileInputRef = useRef(null);
	const containerRef = useRef(null);
	const [footerPos, setFooterPos] = useState({ left: 0, width: 0 });

	useEffect(() => {
		// If a persisted chat is selected, load messages. If a transient chat is selected, clear messages.
		if (!selectedChat) {
			setMessages([]);
			setLoadingMessages(false);
			return;
		}
		if (selectedChat?.id) {
			loadMessages();
		} else {
			// transient chat (no id) — clear messages and mark messages as loaded
			setMessages([]);
			setLoadingMessages(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedChat?.id]);

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
				.eq("chat_id", selectedChat.id)
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

	// Chat list and creation are handled by the parent (Dashboard) and passed via props.

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
			// If the selected chat is transient (no id), do not persist until after we get AI response and a title
			if (!selectedChat || !selectedChat.id) {
				// Keep messages locally until we create the chat
				const localUserMsg = {
					id: `local-${Date.now()}-user`,
					chat_id: null,
					user_id: user.id || null,
					role: "user",
					content: userMessage,
					image_url: imageUrl,
					created_at: new Date().toISOString(),
				};
				setMessages((prev) => [...prev, localUserMsg]);

				const aiResponse = await generateAIResponse(
					userMessage,
					project,
					imageUrl
				);

				const localAiMsg = {
					id: `local-${Date.now()}-ai`,
					chat_id: null,
					user_id: null,
					role: "assistant",
					content: aiResponse,
					created_at: new Date().toISOString(),
				};
				setMessages((prev) => [...prev, localAiMsg]);

				// Ask groq for a short chat title based on the conversation
				try {
					const res = await fetch("/api/chat/title", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							messages: [
								...messages,
								{
									role: localUserMsg.role,
									content: localUserMsg.content,
								},
								{
									role: localAiMsg.role,
									content: localAiMsg.content,
								},
							],
							project,
						}),
					});
					let title = null;
					if (res.ok) {
						const { title: t } = await res.json();
						title = (t || "").trim();
						// sanitize and shorten
						if (title.includes("\n")) title = title.split("\n")[0];
						if (title.length > 60)
							title = title.slice(0, 60) + "...";
					}

					// Persist chat and messages
					const { data: createdChat, error: chatErr } = await supabase
						.from("chats")
						.insert({
							project_id: project.id,
							name: title || "Chat",
							created_at: new Date().toISOString(),
						})
						.select()
						.single();

					if (chatErr) throw chatErr;

					// Insert both messages into DB with the new chat id
					const inserts = [
						{
							chat_id: createdChat.id,
							user_id: localUserMsg.user_id,
							role: localUserMsg.role,
							content: localUserMsg.content,
							image_url: localUserMsg.image_url,
							created_at: localUserMsg.created_at,
						},
						{
							chat_id: createdChat.id,
							user_id: null,
							role: localAiMsg.role,
							content: localAiMsg.content,
							created_at: localAiMsg.created_at,
						},
					];

					const { data: savedMsgs, error: msgsErr } = await supabase
						.from("chat_messages")
						.insert(inserts)
						.select();

					if (msgsErr) throw msgsErr;

					// replace local messages with saved ones
					setMessages(savedMsgs || []);

					// notify parent so it shows the chat in sidebar
					if (onChatSaved) onChatSaved(createdChat);
				} catch (err) {
					console.error(
						"Error creating chat and saving messages:",
						err
					);
				}
				return;
			}

			// Persisted chat path (existing behavior)
			const { data: userMsg, error: userError } = await supabase
				.from("chat_messages")
				.insert({
					chat_id: selectedChat.id,
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
					chat_id: selectedChat.id,
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
						setFileName(file.name);
						console.log("File name:", file.name);
						setFileSize(file.size);
						console.log("File size:", file.size);

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

	// measure the chat container so the fixed footer's inner container can align to it
	useEffect(() => {
		const update = () => {
			const el = containerRef.current;
			if (!el) return;
			const rect = el.getBoundingClientRect();
			setFooterPos({
				left: rect.left + window.scrollX,
				width: rect.width,
			});
		};

		update();
		window.addEventListener("resize", update);
		const ro = new ResizeObserver(update);
		ro.observe(document.body);

		return () => {
			window.removeEventListener("resize", update);
			ro.disconnect();
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className="flex-1 flex flex-col min-h-0 relative"
		>
			<div className="flex-1 overflow-y-auto bg-slate-50 py-8 pb-42">
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
						project={project}
						selectedChat={selectedChat}
					/>
				)}
			</div>

			<div className="fixed bottom-0 left-0 right-0 z-30">
				<div
					className="bg-slate-50 h-6 z-20"
					style={
						footerPos.width
							? {
									position: "absolute",
									left: `${footerPos.left}px`,
									width: `${footerPos.width}px`,
									bottom: 0,
							  }
							: {
									position: "absolute",
									left: 0,
									right: 0,
									bottom: 0,
							  }
					}
				></div>
				<div
					className="bg-white border border-slate-200 px-3 py-3 rounded-2xl mb-3 z-50"
					onClick={() => inputRef.current.focus()}
					style={
						footerPos.width
							? {
									position: "absolute",
									left: `${footerPos.left}px`,
									width: `${footerPos.width}px`,
									bottom: 0,
							  }
							: {
									position: "absolute",
									left: 0,
									right: 0,
									bottom: 0,
							  }
					}
				>
					{/* Preview */}
					{previewUrl && (
						<Card className="w-full mb-3 flex items-center gap-3 p-2 rounded-xl border bg-muted/30">
							{/* Thumbnail */}
							<div className="relative h-12 w-12 shrink-0">
								<img
									src={previewUrl}
									alt="Preview"
									className="h-12 w-12 rounded-md object-cover"
								/>
								<Button
									size="icon"
									variant="secondary"
									onClick={() => {
										setSelectedImage(null);
										setPreviewUrl(null);
										if (fileInputRef.current)
											fileInputRef.current.value = "";
									}}
									className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 cursor-pointer"
								>
									✕
								</Button>
							</div>

							{/* File info */}
							<div className="flex flex-col min-w-0">
								<span className="text-sm font-medium truncate">
									{fileName || "Uploaded image"}
								</span>
								<span className="text-xs text-muted-foreground">
									{fileSize
										? `${(fileSize / 1024).toFixed(1)} KB`
										: ""}
								</span>
							</div>
						</Card>
					)}

					<textarea
						ref={inputRef}
						type="text"
						value={input}
						onChange={(e) => {
							setInput(e.target.value);
							// Auto-resize logic:
							e.target.style.height = "auto";
							e.target.style.height = `${Math.min(
								e.target.scrollHeight,
								128
							)}px`; // 128px = max-h-32
						}}
						onKeyDown={handleKeyPress}
						onPaste={handlePaste}
						disabled={loading}
						placeholder="Ask me anything about your SaaS..."
						className="w-full flex-1 mb-3 outline-none transition-all disabled:opacity-50 max-h-32 resize-none"
						rows="1"
					/>
					<div
						className={`flex gap-3 justify-between ${
							isDragActive
								? "ring-2 ring-slate-400/40 rounded-xl"
								: ""
						}`}
						onDragEnter={handleDragEnter}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
					>
						{/* Model selector */}

						{/* Model selector */}
						<Select
							value={model}
							onValueChange={(val) => setModel(val)}
						>
							<SelectTrigger className="shrink-0 p-1 rounded-md border border-slate-300 bg-white focus:ring-2 focus:ring-slate-900/10 outline-none w-40">
								<SelectValue placeholder="Select model" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Model</SelectLabel>
									<SelectItem value="reasoning">
										Reasoning
									</SelectItem>
									<SelectItem value="web_search">
										Web Search
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>

						<div className="flex gap-3 items-center">
							{/* Image picker */}
							<div className="shrink-0">
								<input
									type="file"
									accept="image/*"
									id="chat-image-input"
									ref={fileInputRef}
									className="hidden"
									onChange={async (e) => {
										const file =
											e.target.files?.[0] ?? null;
										if (!file) return;
										setSelectedImage(file);
										const url = URL.createObjectURL(file);
										setPreviewUrl(url);
									}}
								/>
								<label
									htmlFor="chat-image-input"
									className="cursor-pointer rounded-lg hover:bg-slate-100"
								>
									<Image className="w-5 h-5 text-slate-600" />
								</label>
							</div>

							<button
								onClick={handleSend}
								disabled={loading || !input.trim()}
								className="bg-slate-900 text-white p-2.5 rounded-sm hover:bg-slate-800 transition-all font-medium shadow-lg shadow-slate-900/10 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								<Send className="w-3 h-3" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
