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
		<div className="min-h-screen bg-slate-50 flex">
			<aside className="w-80 bg-white border-r border-slate-200 flex flex-col">
				<div className="p-6 border-b border-slate-200">
					<Link href="/" className="flex items-center gap-2 mb-6">
						<img
							src="/logo.svg"
							alt="SaaSMind Logo"
							className="w-8 h-8"
						/>
						<span className="text-xl font-bold text-slate-900">
							SaaSMind
						</span>
					</Link>

					<button
						onClick={() => setIsProjectModalOpen(true)}
						className="w-full bg-slate-900 cursor-pointer text-white px-4 py-3 rounded-lg hover:bg-slate-800 transition-all font-medium shadow-lg shadow-slate-900/10 hover:shadow-xl flex items-center justify-center gap-2"
					>
						<Plus className="w-5 h-5" />
						New Project
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-4">
					<h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
						Your Projects
					</h3>
					{projects.length === 0 ? (
						<div className="text-center py-8 px-4">
							<Rocket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
							<p className="text-slate-600 text-sm mb-2">
								No projects yet
							</p>
							<p className="text-slate-500 text-xs">
								Create your first project to get started
							</p>
						</div>
					) : (
						<div className="space-y-2">
							{projects.map((project) => (
								<button
									key={project.id}
									onClick={() => setSelectedProject(project)}
									className={`w-full text-left p-4 rounded-lg transition-all ${
										selectedProject?.id === project.id
											? "bg-slate-900 text-white shadow-lg"
											: "hover:bg-slate-50 text-slate-900"
									}`}
								>
									<div className="flex items-start justify-between gap-2 mb-2">
										<h4 className="font-semibold truncate">
											{project.name}
										</h4>
										<span
											className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
												selectedProject?.id ===
												project.id
													? "bg-white/20 text-white"
													: getStatusColor(
															project.status
													  )
											}`}
										>
											{project.status}
										</span>
									</div>
									{project.description && (
										<p
											className={`text-sm line-clamp-2 ${
												selectedProject?.id ===
												project.id
													? "text-slate-300"
													: "text-slate-600"
											}`}
										>
											{project.description}
										</p>
									)}
								</button>
							))}
						</div>
					)}
				</div>

				<div className="p-4 border-t border-slate-200">
					<div className="flex items-center gap-3 mb-3 px-2">
						<div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
							{user?.email?.[0].toUpperCase()}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-slate-900 truncate">
								{user?.email}
							</p>
							<p className="text-xs text-slate-500">Free Plan</p>
						</div>
					</div>
					<div className="space-y-1">
						<button className="w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 text-sm">
							<Settings className="w-4 h-4" />
							Settings
						</button>
						<button
							onClick={() => logoutUser()}
							className="w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 text-sm"
						>
							<LogOut className="w-4 h-4" />
							Sign Out
						</button>
					</div>
				</div>
			</aside>

			<main className="flex-1 flex flex-col">
				{selectedProject ? (
					<Chat project={selectedProject} />
				) : (
					<div className="flex-1 flex items-center justify-center">
						<div className="text-center max-w-md">
							<MessageSquare className="w-20 h-20 text-slate-300 mx-auto mb-6" />
							<h2 className="text-2xl font-bold text-slate-900 mb-3">
								Start Your First Project
							</h2>
							<p className="text-slate-600 mb-6">
								Create a project to begin chatting with your AI
								product assistant
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
		</div>
	);
}
