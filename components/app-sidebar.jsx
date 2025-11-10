"use client";

import * as React from "react";
import {
	AudioWaveform,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	Map,
	PieChart,
	Settings2,
	SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavChats } from "@/components/nav-chats";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
	user: {},
	teams: [],
	navMain: [],

	projects: [],
};

export function AppSidebar({
	projects = [],
	user = null,
	selectedProject = null,
	onSelectProject,
	chats = [],
	selectedChat = null,
	onSelectChat,
	onCreateProject,
	onCreateChat,
	onDeleteChat,
	onOpenProjectContext,
	...props
}) {
	// Use sample nav from generated data for now. Keep navMain sample data.
	const navMain = data.navMain;
	const hasProjects = projects && projects.length > 0;

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				{hasProjects && (
					<TeamSwitcher
						projects={projects}
						selectedProject={selectedProject}
						onSelectProject={onSelectProject}
						onCreateProject={onCreateProject}
					/>
				)}
			</SidebarHeader>
			<SidebarContent>
				{/* Top: Project Context quick action (replaces chat area) */}
				{hasProjects && (
					<>
						<div className="px-3 py-2">
							<button
								onClick={() =>
									onOpenProjectContext &&
									onOpenProjectContext()
								}
								className={`group w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-glass transition-colors ${
									selectedProject
										? "cursor-pointer"
										: "opacity-50 pointer-events-none"
								}`}
								disabled={!selectedProject}
								aria-disabled={!selectedProject}
							>
								<BookOpen className="w-4 h-4" />
								<span className="font-medium">
									Project Context
								</span>
							</button>
						</div>

						<hr className="border-surface-glass" />
					</>
				)}

				{!hasProjects ? (
					<div className="px-4 py-6 flex flex-col items-center gap-3 text-center">
						<Bot className="w-8 h-8 text-muted-foreground" />
						<div className="text-sm font-semibold">
							No projects yet
						</div>
						<p className="text-xs text-muted-foreground max-w-[16rem]">
							Create a project to get started — manage assistants,
							chats and contexts here.
						</p>
						<Button
							size="default"
							className="mt-2"
							onClick={() => onCreateProject && onCreateProject()}
						>
							Create your first project
						</Button>
					</div>
				) : (
					<>
						{selectedProject && (
							<NavChats
								chats={chats}
								selectedChat={selectedChat}
								onSelect={onSelectChat}
								onCreate={onCreateChat}
								onDelete={onDeleteChat}
							/>
						)}
					</>
				)}
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user || data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
