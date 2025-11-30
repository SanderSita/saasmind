import ClientDashboard from "./ClientDashboard";
import {
	createClient,
	useUser as getServerUser,
} from "@/utils/supabase/server";

export default async function Dashboard() {
	// Fetch user and initial data on the server
	const user = await getServerUser();
	const supabase = await createClient();

	let projects = [];
	let chats = [];
	let selectedProject = null;

	try {
		if (user?.id) {
			const { data: projectsData } = await supabase
				.from("projects")
				.select("*")
				.eq("user_id", user.id);
			projects = projectsData || [];
			selectedProject = projects.length ? projects[0] : null;

			if (selectedProject?.id) {
				const { data: chatsData } = await supabase
					.from("chats")
					.select("*")
					.eq("project_id", selectedProject.id)
					.order("created_at", { ascending: true });
				chats = chatsData || [];
			}
		}
	} catch (err) {
		console.error("Error fetching dashboard data on server:", err);
	}

	// Render a small server wrapper and hydrate the interactive client component
	return (
		<ClientDashboard
			initialProjects={projects}
			initialSelectedProject={selectedProject}
			initialChats={chats}
			user={user}
		/>
	);
}
