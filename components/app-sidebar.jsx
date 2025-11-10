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
	...props
}) {
	// Use sample nav from generated data for now. Keep navMain sample data.
	const navMain = data.navMain;

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher
					projects={projects.length ? projects : data.teams}
					selectedProject={selectedProject}
					onSelectProject={onSelectProject}
					onCreateProject={onCreateProject}
				/>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
				{/* <NavProjects
					projects={projects.length ? projects : data.projects}
					onSelect={onSelectProject}
				/> */}
				{selectedProject && (
					<NavChats
						chats={chats}
						selectedChat={selectedChat}
						onSelect={onSelectChat}
						onCreate={onCreateChat}
					/>
				)}
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user || data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
