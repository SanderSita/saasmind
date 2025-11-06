"use client";

import { useState, useEffect } from "react";
import {
	Sparkles,
	Plus,
	MessageSquare,
	LogOut,
	Settings,
	Rocket,
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { getUser, logout } from "@/context/UserContext";
import Link from "next/link";
import CreateProjectDialog from "../components/project/CreateProjectDialog";
import Chat from "../components/chat/Chat";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Dashboard() {
	const [projects, setProjects] = useState([]);
	const [selectedProject, setSelectedProject] = useState(null);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	const user = getUser();

	useEffect(() => {
		loadProjects();
	}, []);

	const logoutUser = () => {
		logout();
		window.location.href = "/";
	};

	const loadProjects = async () => {
		try {
			const { data, error } = await supabase.from("projects").select("*");

			if (error) throw error;
			setProjects(data || []);
			if (data && data.length > 0 && !selectedProject) {
				setSelectedProject(data[0]);
			}
		} catch (error) {
			console.error("Error loading projects:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleProjectCreated = (project) => {
		setProjects([project, ...projects]);
		setSelectedProject(project);
		setIsProjectModalOpen(false);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "idea":
				return "bg-blue-100 text-blue-700";
			case "development":
				return "bg-amber-100 text-amber-700";
			case "launched":
				return "bg-emerald-100 text-emerald-700";
			default:
				return "bg-slate-100 text-slate-700";
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center">
				<div className="text-center">
					<Sparkles className="w-12 h-12 text-slate-400 animate-pulse mx-auto mb-4" />
					<p className="text-slate-600">Loading your projects...</p>
				</div>
			</div>
		);
	}

	return (
		// add top padding to avoid overlap with the fixed global header
		<SidebarProvider>
			<div className="min-h-screen bg-slate-50 flex w-full">
				<AppSidebar
					user={{ name: user?.email, email: user?.email }}
					selectedProject={selectedProject}
					projects={projects}
					onSelectProject={setSelectedProject}
					onCreateProject={() => setIsProjectModalOpen(true)}
				/>

				<main className="flex-1 flex items-center justify-center min-h-screen overflow-hidden">
					{selectedProject ? (
						<div className="w-full flex items-center justify-center">
							<div className="w-full max-w-4xl px-4">
								<Chat project={selectedProject} />
							</div>
						</div>
					) : (
						<div className="flex-1 flex items-center justify-center">
							<div className="text-center max-w-md">
								<MessageSquare className="w-20 h-20 text-slate-300 mx-auto mb-6" />
								<h2 className="text-2xl font-bold text-slate-900 mb-3">
									Start Your First Project
								</h2>
								<p className="text-slate-600 mb-6">
									Create a project to begin chatting with your
									AI product assistant
								</p>
								<button
									onClick={() => setIsProjectModalOpen(true)}
									className="bg-slate-900 cursor-pointer text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-all font-medium shadow-lg inline-flex items-center gap-2"
								>
									<Plus className="w-5 h-5" />
									Create Project
								</button>
							</div>
						</div>
					)}
				</main>

				{/* Create Project Dialog */}
				<CreateProjectDialog
					open={isProjectModalOpen}
					onOpenChange={setIsProjectModalOpen}
					onCreate={handleProjectCreated}
				/>
			</div>
		</SidebarProvider>
	);
}
