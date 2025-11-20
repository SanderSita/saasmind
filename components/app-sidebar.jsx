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
	Trash2,
	Download,
	Edit3,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavChats } from "@/components/nav-chats";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/app/components/ui/dialog";

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
	onRenameChat,
	onOpenProjectContext,
	...props
}) {
	// Use sample nav from generated data for now. Keep navMain sample data.
	const navMain = data.navMain;
	const hasProjects = projects && projects.length > 0;

	// Sidebar helper
	const { isMobile } = useSidebar();

	// Local copy of projects so UI can update immediately on rename/delete
	const [localProjects, setLocalProjects] = React.useState(projects);
	React.useEffect(() => setLocalProjects(projects), [projects]);

	// Project settings dialog state
	const [projConfirmOpen, setProjConfirmOpen] = React.useState(false);
	const [projDeleting, setProjDeleting] = React.useState(false);
	const router = useRouter();

	// Rename dialog state
	const [renameOpen, setRenameOpen] = React.useState(false);
	const [renameName, setRenameName] = React.useState("");
	const [renameLoading, setRenameLoading] = React.useState(false);

	async function handleConfirmDelete() {
		if (!selectedProject) return;
		setProjDeleting(true);
		try {
			// If parent provided a handler, prefer that (may do extra cleanup)
			if (typeof props.onDeleteProject === "function") {
				await props.onDeleteProject(selectedProject);
			} else {
				// Default: delete from Supabase 'projects' table
				const { error } = await supabase
					.from("projects")
					.delete()
					.eq("id", selectedProject.id);
				if (error) throw error;
			}
			// Close dialog and refresh UI
			setProjConfirmOpen(false);
			// refresh current route to reflect deleted project
			try {
				window.location.reload();
			} catch (e) {
				// ignore refresh errors
			}
		} catch (err) {
			console.error("Failed to delete project", err);
			// Optionally show toast — omitted here
		} finally {
			setProjDeleting(false);
		}
	}

	async function handleConfirmRename() {
		if (!selectedProject) return;
		const newName = (renameName || "").trim();
		if (!newName) return;
		setRenameLoading(true);
		try {
			if (typeof props.onRenameProject === "function") {
				await props.onRenameProject(selectedProject, newName);
			} else {
				const { error } = await supabase
					.from("projects")
					.update({ name: newName })
					.eq("id", selectedProject.id);
				if (error) throw error;
			}
			// Update local projects and selected project so UI updates immediately
			const updated = { ...(selectedProject || {}), name: newName };
			setLocalProjects((prev) =>
				prev
					? prev.map((p) =>
							String(p.id) === String(updated.id) ? updated : p
					  )
					: prev
			);
			if (typeof onSelectProject === "function") onSelectProject(updated);
			setRenameOpen(false);
			try {
				router.refresh();
			} catch (e) {}
		} catch (err) {
			console.error("Failed to rename project", err);
		} finally {
			setRenameLoading(false);
		}
	}

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				{hasProjects && (
					<TeamSwitcher
						projects={localProjects}
						selectedProject={selectedProject}
						onSelectProject={onSelectProject}
						onCreateProject={onCreateProject}
					/>
				)}
			</SidebarHeader>
			<SidebarContent>
				{hasProjects && (
					<SidebarGroup className="group-data-[collapsible=icon]:hidden">
						<SidebarGroupContent className="flex flex-col gap-2">
							<SidebarMenuItem className="flex items-center gap-2">
								<SidebarMenuButton
									tooltip="Project Context"
									className={"justify-baseline font-normal"}
									onClick={() =>
										onOpenProjectContext &&
										onOpenProjectContext()
									}
									disabled={!selectedProject}
									aria-disabled={!selectedProject}
								>
									<BookOpen size={16} className="my-auto" />
									<span>Project Context</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarGroupContent>
					</SidebarGroup>
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
							variant="default"
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
								onRename={onRenameChat}
							/>
						)}
					</>
				)}
			</SidebarContent>
			<SidebarFooter>
				{selectedProject && (
					<div className="">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton asChild>
									<Button
										variant="ghost"
										size="sm"
										className="justify-baseline font-normal"
									>
										<Settings2 className="size-4" />
										<span>Project Settings</span>
									</Button>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-48 rounded-lg"
								side={isMobile ? "bottom" : "right"}
								align="end"
							>
								<DropdownMenuItem
									onClick={() => {
										setRenameName(
											selectedProject?.name ?? ""
										);
										setRenameOpen(true);
									}}
								>
									<Edit3 className="text-muted-foreground" />
									<span>Rename Project</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => setProjConfirmOpen(true)}
									data-variant="destructive"
								>
									<Trash2 className="text-destructive" />
									<span>Delete Project</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)}

				<NavUser user={user || data.user} />

				{/* Delete confirmation dialog for project */}
				<Dialog
					open={projConfirmOpen}
					onOpenChange={(open) => {
						setProjConfirmOpen(open);
					}}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete Project</DialogTitle>
							<DialogDescription>
								{selectedProject ? (
									<>
										Are you sure you want to delete "
										{selectedProject.name}"? This action
										cannot be undone.
									</>
								) : (
									<>Delete project?</>
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
								onClick={handleConfirmDelete}
								disabled={projDeleting}
							>
								{projDeleting
									? "Deleting..."
									: "Delete Project"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Rename project dialog */}
				<Dialog
					open={renameOpen}
					onOpenChange={(open) => {
						setRenameOpen(open);
						if (!open) setRenameName("");
					}}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Rename Project</DialogTitle>
							<DialogDescription>
								Provide a new name for the project.
							</DialogDescription>
						</DialogHeader>

						<div className="mt-2">
							<input
								autoFocus
								value={renameName}
								onChange={(e) => setRenameName(e.target.value)}
								className="w-full border px-3 py-2 bg-white text-slate-900"
								placeholder="Project name"
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
								onClick={handleConfirmRename}
								disabled={renameLoading}
							>
								{renameLoading ? "Renaming..." : "Rename"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
