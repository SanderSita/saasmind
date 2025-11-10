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
}) {
	const { isMobile } = useSidebar();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [pendingChat, setPendingChat] = useState(null);

	function openConfirm(e, chat) {
		e.preventDefault();
		e.stopPropagation();
		setPendingChat(chat);
		setConfirmOpen(true);
	}

	function confirmDelete() {
		if (onDelete && pendingChat) onDelete(pendingChat);
		setConfirmOpen(false);
		setPendingChat(null);
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
								className="w-48 rounded-lg"
								side={isMobile ? "bottom" : "right"}
								align={isMobile ? "end" : "start"}
							>
								<DropdownMenuItem>
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
						className="text-sidebar-foreground/70"
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
		</SidebarGroup>
	);
}
