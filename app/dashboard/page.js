"use client";

import { useState, useEffect } from "react";
import { Sparkles, Plus, MessageSquare } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useUser, logout } from "@/context/UserContext";
import CreateProjectDialog from "../components/project/CreateProjectDialog";
import Chat from "../components/chat/Chat";
import { AppSidebar } from "@/components/app-sidebar";
import ProjectContext from "@/components/project/ProjectContext";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Dashboard() {
	const [projects, setProjects] = useState([]);
	const [selectedProject, setSelectedProject] = useState(null);
	const [chats, setChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [view, setView] = useState("chat"); // 'chat' | 'project'
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	const user = useUser();

	useEffect(() => {
		loadProjects();
	}, []);

	useEffect(() => {
		if (selectedProject?.id) loadChats();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedProject?.id]);

	useEffect(() => {
		// whenever a new project is selected, default back to chat view
		if (selectedProject) setView("chat");
	}, [selectedProject?.id]);

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

	const loadChats = async () => {
		try {
			const { data, error } = await supabase
				.from("chats")
				.select("*")
				.eq("project_id", selectedProject.id)
				.order("created_at", { ascending: true });

			if (error) throw error;
			if (data && data.length > 0) {
				setChats(data);
				setSelectedChat(data[0]);
			} else {
				setChats([]);
				setSelectedChat(null);
			}
		} catch (err) {
			console.error("Error loading chats:", err);
		}
	};

	// Persist a new chat to the DB and add to the list
	const persistChat = async (name) => {
		try {
			const { data, error } = await supabase
				.from("chats")
				.insert({
					project_id: selectedProject.id,
					name: name || `Chat ${new Date().toLocaleString()}`,
					created_at: new Date().toISOString(),
				})
				.select()
				.single();

			if (error) throw error;
			setChats((prev) => [...prev, data]);
			setSelectedChat(data);
			return data;
		} catch (err) {
			console.error("Error creating chat:", err);
			return null;
		}
	};

	// Start a transient (unsaved) chat: not persisted until first message is sent
	const startTransientChat = () => {
		const temp = {
			id: null,
			name: "New chat",
			isTemp: true,
			created_at: new Date().toISOString(),
		};
		// select the transient chat and switch the main view to chat
		setSelectedChat(temp);
		setView("chat");
	};

	// Delete a chat (persisted) or remove a transient chat from state
	const deleteChat = async (chat) => {
		try {
			// transient chat (no id) -> remove locally
			if (!chat?.id) {
				setChats((prev) => prev.filter((c) => c !== chat));
				if (selectedChat === chat) setSelectedChat(null);
				return;
			}

			const { error } = await supabase
				.from("chats")
				.delete()
				.eq("id", chat.id);

			if (error) throw error;

			setChats((prev) => prev.filter((c) => c.id !== chat.id));
			if (selectedChat && selectedChat.id === chat.id) {
				// select next available chat or clear
				const next =
					(chats || []).find((c) => c.id !== chat.id) || null;
				setSelectedChat(next);
			}
		} catch (err) {
			console.error("Error deleting chat:", err);
		}
	};

	// Rename a chat (persisted) or update a transient chat locally
	const renameChat = async (chat, newName) => {
		try {
			if (!chat?.id) {
				// transient chat -> update locally by reference or index
				setChats((prev) =>
					prev.map((c) => (c === chat ? { ...c, name: newName } : c))
				);
				if (selectedChat === chat)
					setSelectedChat({ ...chat, name: newName });
				return { ...chat, name: newName };
			}

			const { data, error } = await supabase
				.from("chats")
				.update({ name: newName })
				.eq("id", chat.id)
				.select()
				.single();

			if (error) throw error;

			setChats((prev) => prev.map((c) => (c.id === chat.id ? data : c)));
			if (selectedChat && selectedChat.id === chat.id) {
				setSelectedChat(data);
			}
			return data;
		} catch (err) {
			console.error("Error renaming chat:", err);
			return null;
		}
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
					onSelectProject={(p) => {
						setSelectedProject(p);
						setView("chat");
					}}
					onCreateProject={() => setIsProjectModalOpen(true)}
					chats={chats}
					selectedChat={selectedChat}
					onSelectChat={(c) => {
						setSelectedChat(c);
						setView("chat");
					}}
					onCreateChat={() => startTransientChat()}
					onDeleteChat={(c) => deleteChat(c)}
					onRenameChat={(c, name) => renameChat(c, name)}
					onOpenProjectContext={async () => {
						// Refresh project data from the DB before opening project context
						if (!selectedProject || !selectedProject.id)
							return setView("project");
						try {
							const { data, error } = await supabase
								.from("projects")
								.select("*")
								.eq("id", selectedProject.id)
								.single();
							if (!error && data) {
								setSelectedProject(data);
							}
						} catch (err) {
							console.error("Error refreshing project:", err);
						} finally {
							setView("project");
						}
					}}
				/>

				<main className="flex-1 flex items-center justify-center min-h-screen overflow-hidden">
					{selectedProject ? (
						<div className="w-full flex items-center justify-center">
							{view === "chat" ? (
								<div className="w-full max-w-4xl px-4">
									<Chat
										project={selectedProject}
										selectedChat={selectedChat}
										onChatSaved={(chat) => {
											// when chat is saved by Chat component, add it to list and select it
											setChats((prev) => [chat, ...prev]);
											setSelectedChat(chat);
										}}
									/>
								</div>
							) : (
								// project context view
								<ProjectContext project={selectedProject} />
							)}
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
									className="bg-slate-900 cursor-pointer text-white px-6 py-3  hover:bg-slate-800 transition-all font-medium shadow-lg inline-flex items-center gap-2"
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
