"use client";

import React, { useState } from "react";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/app/components/ui/dialog";

import { Button } from "@/components/ui/button";

export function NavChats({
	chats = [],
	selectedChat = null,
	onSelect,
	onCreate,
	onDelete,
	onRename,
}) {
	const { isMobile } = useSidebar();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [pendingChat, setPendingChat] = useState(null);
	const [renameOpen, setRenameOpen] = useState(false);
	const [renameName, setRenameName] = useState("");
	const [renameLoading, setRenameLoading] = useState(false);

	function openConfirm(e, chat) {
		e.preventDefault();
		e.stopPropagation();
		setPendingChat(chat);
		setConfirmOpen(true);
	}

	function openRename(e, chat) {
		e.preventDefault();
		e.stopPropagation();
		setPendingChat(chat);
		setRenameName(chat?.name || "");
		setRenameOpen(true);
	}

	function confirmDelete() {
		if (onDelete && pendingChat) onDelete(pendingChat);
		setConfirmOpen(false);
		setPendingChat(null);
	}

	async function confirmRename() {
		if (!pendingChat) return;
		const newName = (renameName || "").trim();
		if (!newName) return;
		try {
			setRenameLoading(true);
			if (onRename) {
				// onRename may be async; await it if it returns a promise
				await onRename(pendingChat, newName);
			}
			// close
			setRenameOpen(false);
			setPendingChat(null);
		} catch (err) {
			console.error("Rename failed", err);
		} finally {
			setRenameLoading(false);
		}
	}

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Chats</SidebarGroupLabel>
			<SidebarMenu>
				{chats.map((chat) => (
					<SidebarMenuItem key={chat.id}>
						<Tooltip delayDuration={500}>
							<TooltipTrigger asChild>
								<SidebarMenuButton asChild>
									<button
										onClick={(e) => {
											if (onSelect) {
												e.preventDefault();
												onSelect(chat);
											}
										}}
										className={
											chat.id === selectedChat?.id
												? "font-semibold"
												: ""
										}
									>
										<span>{chat.name}</span>
									</button>
								</SidebarMenuButton>
							</TooltipTrigger>
							<TooltipContent>
								<p>{chat.name}</p>
							</TooltipContent>
						</Tooltip>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									<MoreHorizontal />
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-48"
								side={isMobile ? "bottom" : "right"}
								align={isMobile ? "end" : "start"}
							>
								<DropdownMenuItem
									onClick={(e) => openRename(e, chat)}
								>
									<span>Rename</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={(e) => openConfirm(e, chat)}
								>
									<Trash2 className="text-muted-foreground" />
									<span>Delete Chat</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}
				<SidebarMenuItem>
					<SidebarMenuButton
						className="text-sidebar-foreground/70 cursor-pointer"
						onClick={() => onCreate && onCreate()}
					>
						<Plus className="text-sidebar-foreground/70" />
						<span>Create Chat</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>

			<Dialog
				open={confirmOpen}
				onOpenChange={(open) => {
					setConfirmOpen(open);
					if (!open) setPendingChat(null);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Chat</DialogTitle>
						<DialogDescription>
							{pendingChat ? (
								<>
									Are you sure you want to delete "
									{pendingChat.name}"? This action cannot be
									undone.
								</>
							) : (
								<>Delete chat?</>
							)}
						</DialogDescription>
					</DialogHeader>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline" size="sm">
								Cancel
							</Button>
						</DialogClose>
						<Button
							variant="destructive"
							size="sm"
							onClick={confirmDelete}
						>
							Delete Chat
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Rename dialog */}
			<Dialog
				open={renameOpen}
				onOpenChange={(open) => {
					setRenameOpen(open);
					if (!open) {
						setPendingChat(null);
						setRenameName("");
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Rename Chat</DialogTitle>
						<DialogDescription>
							Provide a new name for the chat.
						</DialogDescription>
					</DialogHeader>

					<div className="mt-2">
						<input
							autoFocus
							value={renameName}
							onChange={(e) => setRenameName(e.target.value)}
							className="w-full border px-3 py-2 bg-white text-slate-900"
							placeholder="Chat name"
						/>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline" size="sm">
								Cancel
							</Button>
						</DialogClose>
						<Button
							variant="default"
							size="sm"
							onClick={confirmRename}
							disabled={renameLoading}
						>
							{renameLoading ? "Renaming..." : "Rename"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</SidebarGroup>
	);
}
