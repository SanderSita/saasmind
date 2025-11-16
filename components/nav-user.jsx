"use client";

import React, { useState } from "react";
import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

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
import { supabase } from "@/utils/supabase/client";

export function NavUser({ user }) {
	const { isMobile } = useSidebar();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [logoutLoading, setLogoutLoading] = useState(false);

	async function handleLogout() {
		try {
			setLogoutLoading(true);
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error("Logout error:", error);
			}
		} catch (err) {
			console.error("Logout failed", err);
		} finally {
			setLogoutLoading(false);
			setConfirmOpen(false);
			try {
				window.location.assign("/");
			} catch (e) {
				window.location.href = "/";
			}
		}
	}

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user.avatar}
										alt={user.name}
									/>
									<AvatarFallback className="rounded-lg">
										{user.name
											? user.name
													.split(" ")
													.map((n) => n[0])
													.join("")
													.slice(0, 2)
											: ""}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{user.name}
									</span>
									<span className="truncate text-xs">
										{user.email}
									</span>
								</div>
								<ChevronsUpDown className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
							side={isMobile ? "bottom" : "right"}
							align="end"
							sideOffset={4}
						>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={user.avatar}
											alt={user.name}
										/>
										<AvatarFallback className="rounded-lg">
											{user.name
												? user.name
														.split(" ")
														.map((n) => n[0])
														.join("")
														.slice(0, 2)
												: ""}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">
											{user.name}
										</span>
										<span className="truncate text-xs">
											{user.email}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={(e) => {
									e.preventDefault();
									setConfirmOpen(true);
								}}
							>
								<LogOut />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>

			<Dialog
				open={confirmOpen}
				onOpenChange={(open) => {
					setConfirmOpen(open);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Log out</DialogTitle>
						<DialogDescription>
							Are you sure you want to log out? This will end your
							session.
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
							onClick={handleLogout}
							disabled={logoutLoading}
						>
							{logoutLoading ? "Signing out..." : "Sign out"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
