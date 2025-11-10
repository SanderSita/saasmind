"use client";

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

export function NavChats({
	chats = [],
	selectedChat = null,
	onSelect,
	onCreate,
}) {
	const { isMobile } = useSidebar();

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
										<span className="text-xs text-muted-foreground mr-2">
											💬
										</span>
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
								<DropdownMenuItem>
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
		</SidebarGroup>
	);
}
