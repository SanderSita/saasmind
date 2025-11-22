"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
	projects,
	onSelectProject,
	onCreateProject,
	selectedProject,
}) {
	const { isMobile } = useSidebar();
	const [activeProject, setActiveProject] = React.useState(
		selectedProject ?? projects[0] ?? null
	);

	React.useEffect(() => {
		// When the external selectedProject changes, sync local activeProject
		if (selectedProject && selectedProject !== activeProject) {
			setActiveProject(selectedProject);
		}
	}, [selectedProject]);

	React.useEffect(() => {
		// If projects list changes and there's no external selection, ensure we have an active project
		if (!selectedProject && projects && projects.length && !activeProject) {
			setActiveProject(projects[0]);
		}
	}, [projects]);

	if (!activeProject) {
		return null;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className=" cursor-pointer border bg-white border-gray-200 data-[state=open]:text-sidebar-accent-foreground hover:bg-white"
						>
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center ">
								{activeProject.logo ? (
									(() => {
										const Logo = activeProject.logo;
										return <Logo className="size-4" />;
									})()
								) : (
									<span className="text-sm font-medium">
										{activeProject.name?.[0]?.toUpperCase()}
									</span>
								)}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{activeProject.name}
								</span>
								<span className="truncate text-xs">
									{activeProject.plan}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 "
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							Projects
						</DropdownMenuLabel>
						{projects.map((project, index) => (
							<DropdownMenuItem
								key={project.name}
								onClick={() => {
									setActiveProject(project);
									if (typeof onSelectProject === "function")
										onSelectProject(project);
								}}
								className="gap-2 p-2"
							>
								<div className="flex size-6 items-center justify-center  border">
									{project.logo ? (
										(() => {
											const ProjectLogo = project.logo;
											return (
												<ProjectLogo className="size-3.5 shrink-0" />
											);
										})()
									) : (
										<span className="text-sm font-medium">
											{project.name?.[0]?.toUpperCase()}
										</span>
									)}
								</div>
								{project.name}
								<DropdownMenuShortcut>
									⌘{index + 1}
								</DropdownMenuShortcut>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="gap-2 p-2"
							onClick={() => {
								if (typeof onCreateProject === "function")
									onCreateProject();
							}}
						>
							<div className="flex size-6 items-center justify-center  border bg-transparent">
								<Plus className="size-4" />
							</div>
							<div className="text-muted-foreground font-medium">
								Add project
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
