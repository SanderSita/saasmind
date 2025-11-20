"use client";

import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Bot, User, FastForward, Copy, Check, BookOpen } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
	DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { preprocessLaTeX } from "@/utils/latex/preprocessLaTeX";

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
		<div className="relative mb-4 group max-w-2xl">
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

const Message = React.memo(
	({ message, isLast, shouldAnimate, project, chat }) => {
		const [displayedText, setDisplayedText] = useState(
			shouldAnimate ? "" : message.content
		);
		const [isTyping, setIsTyping] = useState(shouldAnimate);
		const [copied, setCopied] = useState(false);
		const copyTimeoutRef = useRef(null);
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

		const handleCopyMessage = async () => {
			const text = message.content ?? "";
			if (!text) return;

			try {
				if (navigator.clipboard && navigator.clipboard.writeText) {
					await navigator.clipboard.writeText(text);
				} else {
					const ta = document.createElement("textarea");
					ta.value = text;
					document.body.appendChild(ta);
					ta.select();
					document.execCommand("copy");
					document.body.removeChild(ta);
				}

				setCopied(true);
				if (copyTimeoutRef.current)
					clearTimeout(copyTimeoutRef.current);
				copyTimeoutRef.current = setTimeout(() => {
					setCopied(false);
					copyTimeoutRef.current = null;
				}, 1000);
			} catch (e) {
				// ignore copy errors
			}
		};

		useEffect(() => {
			return () => {
				if (copyTimeoutRef.current)
					clearTimeout(copyTimeoutRef.current);
			};
		}, []);

		return (
			<div
				data-message-id={message.id}
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
					<div className="max-w-[calc(100vw-50px)] overflow-x-auto overflow-y-hidden">
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
									<p
										className="custom-paragraph"
										{...props}
									/>
								),
								thead: ({ node, ...props }) => (
									<thead
										className="text-left border-b py-2"
										{...props}
									/>
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
									<h3
										className="text-xl mb-4 mt-6"
										{...props}
									/>
								),
								h2: ({ node, ...props }) => (
									<h2
										className="text-2xl mb-4 mt-6"
										{...props}
									/>
								),
								td: ({ node, ...props }) => (
									<td className="py-2" {...props} />
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

					{/* show copy icon */}
					<div className="mt-2 flex gap-2 items-center">
						{message.role != "user" && !isTyping && (
							<>
								<button
									onClick={handleCopyMessage}
									onKeyDown={(e) => {
										if (
											e.key === "Enter" ||
											e.key === " "
										) {
											e.preventDefault();
											handleCopyMessage();
										}
									}}
									title={copied ? "Copied" : "Copy message"}
									aria-label={
										copied ? "Copied" : "Copy message"
									}
									className="inline-flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-100 transition"
								>
									{copied ? (
										<>
											<Check className="w-4 h-4 text-slate-700" />
											<span className="sr-only">
												Copied
											</span>
										</>
									) : (
										<>
											<Copy className="w-4 h-4 text-slate-700" />
											<span className="sr-only">
												Copy message
											</span>
										</>
									)}
								</button>

								{/* Open dialog to save message as project custom context */}
								<button
									className="inline-flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-100 transition"
									onClick={() => {
										// emit custom event handled by parent via props (handled below by rendering dialog in MessageList)
										const ev = new CustomEvent(
											"open-save-context",
											{
												detail: { message },
												bubbles: true,
												cancelable: true,
											}
										);
										window.dispatchEvent(ev);
									}}
									title={"Add to context"}
									type="button"
								>
									<BookOpen className="w-4 h-4 text-slate-700" />
									<span className="sr-only">
										Save to project context
									</span>
								</button>
							</>
						)}
					</div>

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
	}
);

const MessageList = React.memo(
	({ messages, loading, endRef, project, selectedChat }) => {
		const prevMessageCount = useRef(messages.length);

		// keep a ref to latest messages so window event handlers see updates
		const messagesRef = useRef(messages);
		useEffect(() => {
			messagesRef.current = messages;
		}, [messages]);

		// dialog state for saving context
		const [dialogOpen, setDialogOpen] = useState(false);
		const [dialogTitle, setDialogTitle] = useState("");
		const [dialogContent, setDialogContent] = useState("");
		const [saving, setSaving] = useState(false);
		const [saveError, setSaveError] = useState(null);

		// selection UI state
		const [selectionText, setSelectionText] = useState("");
		const [selectionRect, setSelectionRect] = useState(null);

		// computed, clamped position for the floating button (page coordinates)
		const [selectionPos, setSelectionPos] = useState(null);
		const addBtnRef = useRef(null);

		useEffect(() => {
			const handleMouseUp = (e) => {
				const sel = window.getSelection();
				if (!sel || sel.isCollapsed) {
					setSelectionText("");
					setSelectionRect(null);
					return;
				}

				const text = sel.toString().trim();
				if (!text) {
					setSelectionText("");
					setSelectionRect(null);
					return;
				}

				// find the deepest common ancestor of the selection range
				let range;
				try {
					range = sel.getRangeAt(0);
				} catch (err) {
					setSelectionText("");
					setSelectionRect(null);
					return;
				}

				let container = range.commonAncestorContainer;
				if (!container) {
					setSelectionText("");
					setSelectionRect(null);
					return;
				}
				if (container.nodeType === 3)
					container = container.parentElement;

				// ensure selection is inside a message element by climbing DOM
				let msgEl = container;
				while (msgEl && !msgEl.dataset?.messageId)
					msgEl = msgEl.parentElement;

				// If commonAncestorContainer didn't locate a message wrapper,
				// try several fallback nodes: anchorNode, focusNode, range start/end.
				if (!msgEl) {
					const tryNodes = [
						sel.anchorNode,
						sel.focusNode,
						range.startContainer,
						range.endContainer,
					];
					for (const n of tryNodes) {
						let node = n;
						if (!node) continue;
						if (node.nodeType === 3) node = node.parentElement;
						let candidate = node;
						while (candidate && !candidate.dataset?.messageId)
							candidate = candidate.parentElement;
						if (candidate) {
							msgEl = candidate;
							break;
						}
					}
				}

				if (!msgEl) {
					setSelectionText("");
					setSelectionRect(null);
					return;
				}

				const messageId = msgEl.dataset.messageId;
				const found = (messagesRef.current || []).find(
					(m) => String(m.id) === String(messageId)
				);
				if (!found || found.role === "user") {
					// only allow adding assistant or non-user content
					setSelectionText("");
					setSelectionRect(null);
					return;
				}

				// compute a usable bounding rect for the selection.
				// For code blocks / multi-line selections, getClientRects() can
				// return multiple rects (one per line). We'll pick the first
				// visible rect or fall back to the union of rects, then to
				// range.getBoundingClientRect(). This gives more reliable
				// positioning for the floating button.
				let rect = null;
				try {
					const clientRects = range.getClientRects();
					if (clientRects && clientRects.length > 0) {
						// find first rect with area > 0
						for (let i = 0; i < clientRects.length; i++) {
							const r = clientRects[i];
							if (r.width > 0 && r.height > 0) {
								rect = r;
								break;
							}
						}

						// if no single rect found (all zero), compute union
						if (!rect && clientRects.length > 0) {
							let left = Infinity,
								top = Infinity,
								right = -Infinity,
								bottom = -Infinity;
							for (let i = 0; i < clientRects.length; i++) {
								const r = clientRects[i];
								if (r.width === 0 && r.height === 0) continue;
								left = Math.min(left, r.left);
								top = Math.min(top, r.top);
								right = Math.max(right, r.right);
								bottom = Math.max(bottom, r.bottom);
							}
							if (left !== Infinity) {
								rect = {
									left,
									top,
									right,
									bottom,
									width: right - left,
									height: bottom - top,
								};
							}
						}
					}
				} catch (err) {
					rect = null;
				}

				if (!rect) {
					try {
						rect = range.getBoundingClientRect();
					} catch (err) {
						rect = null;
					}
				}

				// Prefer to position at the mouse cursor where the user
				// released the selection (gives more intuitive placement).
				// The mouse event is available as `e` in this handler.
				let finalRect = rect;
				try {
					if (
						typeof e?.clientX === "number" &&
						typeof e?.clientY === "number"
					) {
						finalRect = {
							left: e.clientX,
							top: e.clientY,
							width: 0,
							height: 0,
						};
					}
				} catch (err) {
					// ignore and use rect
				}

				if (!finalRect) {
					// As a last resort, clear selection UI
					setSelectionText("");
					setSelectionRect(null);
					return;
				}

				setSelectionText(text);
				setSelectionRect(finalRect);
			};

			const handleKey = (e) => {
				// clear on Escape
				if (e.key === "Escape") {
					setSelectionText("");
					setSelectionRect(null);
				}
			};

			window.addEventListener("mouseup", handleMouseUp);
			window.addEventListener("keyup", handleKey);
			return () => {
				window.removeEventListener("mouseup", handleMouseUp);
				window.removeEventListener("keyup", handleKey);
			};
		}, []);

		// compute clamped button position whenever selectionRect changes
		useEffect(() => {
			if (!selectionRect) {
				setSelectionPos(null);
				return;
			}

			function computePos() {
				const btn = addBtnRef.current;
				const btnW = (btn && btn.offsetWidth) || 120;
				const btnH = (btn && btn.offsetHeight) || 36;

				// selectionRect values (from range.getClientRects() or
				// range.getBoundingClientRect() or mouse event clientX/Y)
				// are in viewport (client) coordinates. We must compute the
				// position in viewport coords because the button is
				// positioned `fixed` (which is relative to the viewport).
				const rectLeft =
					Number(selectionRect.left ?? selectionRect.x ?? 0) || 0;
				const rectTop =
					Number(selectionRect.top ?? selectionRect.y ?? 0) || 0;

				// Prefer showing the button slightly above the selection / cursor
				let left = rectLeft;
				let top = rectTop - 40; // offset above cursor/rect

				// Clamp into the viewport (no scroll offsets because fixed pos)
				const margin = 8;
				const maxLeft = window.innerWidth - btnW - margin;
				const maxTop = window.innerHeight - btnH - margin;
				left = Math.min(Math.max(left, margin), maxLeft);
				top = Math.min(Math.max(top, margin), maxTop);

				// Ensure finite numbers
				if (!Number.isFinite(left) || !Number.isFinite(top)) {
					setSelectionPos(null);
					return;
				}

				setSelectionPos({ left, top });
			}

			computePos();
			window.addEventListener("resize", computePos);
			window.addEventListener("scroll", computePos, { passive: true });
			return () => {
				window.removeEventListener("resize", computePos);
				window.removeEventListener("scroll", computePos);
			};
		}, [selectionRect]);

		useEffect(() => {
			const listener = (e) => {
				const msg = e.detail?.message;
				if (!msg) return;
				setDialogTitle(`context from ${selectedChat?.name ?? "chat"}`);
				setDialogContent(msg.content ?? "");
				setDialogOpen(true);
			};

			window.addEventListener("open-save-context", listener);
			return () =>
				window.removeEventListener("open-save-context", listener);
		}, [selectedChat]);

		const handleSaveContext = async () => {
			if (!project || !project.id) {
				setSaveError("No project selected");
				return;
			}
			setSaving(true);
			setSaveError(null);
			try {
				// Normalize existing custom_context to array
				let existing = [];
				try {
					if (project.custom_context) {
						if (Array.isArray(project.custom_context))
							existing = project.custom_context.slice();
						else if (typeof project.custom_context === "object") {
							existing = Object.entries(
								project.custom_context
							).map(([k, v]) => ({ key: k, value: v }));
						}
					}
				} catch (e) {
					existing = [];
				}

				// append new pair
				const payload = [
					...existing,
					{ key: dialogTitle, value: dialogContent },
				];

				const { data, error } = await supabase
					.from("projects")
					.update({ custom_context: payload })
					.eq("id", project.id)
					.select("*")
					.single();

				if (error) throw error;
				// Optionally update local project representation—consumer should refresh if needed
				setDialogOpen(false);
			} catch (err) {
				setSaveError(err.message || String(err));
			} finally {
				setSaving(false);
			}
		};

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
						project={project}
						chat={selectedChat}
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

				{/* Floating 'Add to context' button shown when user selects text */}
				{selectionText && selectionPos && (
					<button
						ref={addBtnRef}
						className="fixed z-50 bg-slate-900 text-white px-2 py-1 text-sm shadow-lg"
						style={{
							top: selectionPos.top,
							left: selectionPos.left,
						}}
						onClick={() => {
							setDialogTitle(
								`context from ${selectedChat?.name ?? "chat"}`
							);
							setDialogContent(selectionText);
							setDialogOpen(true);
							// clear selection UI
							setSelectionText("");
							setSelectionRect(null);
							setSelectionPos(null);
						}}
					>
						Add to context
					</button>
				)}

				{/* Dialog for saving message as project custom context */}
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{dialogTitle}</DialogTitle>
							<DialogDescription>
								Save the selected message into this project's
								custom context. The content is editable in
								Markdown.
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4">
							<label className="block text-sm font-medium">
								Title
							</label>
							<Input
								value={dialogTitle}
								onChange={(e) => setDialogTitle(e.target.value)}
							/>

							<label className="block text-sm font-medium">
								Content (Markdown)
							</label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<textarea
									className="w-full p-3 border rounded-md min-h-[180px]"
									value={dialogContent}
									onChange={(e) =>
										setDialogContent(e.target.value)
									}
								/>
								<div className="prose max-w-none overflow-auto p-3 border rounded-md bg-white max-h-[360px]">
									<ReactMarkdown
										remarkPlugins={[remarkGfm, remarkMath]}
										rehypePlugins={[rehypeKatex]}
									>
										{preprocessLaTeX(dialogContent)}
									</ReactMarkdown>
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button
								variant="ghost"
								onClick={() => setDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleSaveContext}
								disabled={saving}
							>
								{saving ? "Saving..." : "Save to context"}
							</Button>
						</DialogFooter>
						{saveError && (
							<div className="text-sm text-red-600 mt-2">
								{saveError}
							</div>
						)}
					</DialogContent>
				</Dialog>
			</div>
		);
	}
);

export default MessageList;
