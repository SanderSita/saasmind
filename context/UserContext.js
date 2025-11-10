"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const UserContext = createContext(null);

export function UserProvider({ children, initialUser }) {
	const [user, setUser] = useState(initialUser || null);

	useEffect(() => {
		// 1️⃣ Load existing session on mount
		const loadUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session?.user) {
				const { data: profile } = await supabase
					.from("users")
					.select("*")
					.eq("auth_id", session.user.id)
					.single();

				setUser({
					id: session.user.id,
					email: session.user.email ?? null,
					profile,
				});
			}
		};

		loadUser();

		// 2️⃣ Keep user in sync with auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (!session?.user) {
				setUser(null);
			} else {
				setUser({
					id: session.user.id,
					email: session.user.email ?? null,
				});
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
	return useContext(UserContext);
}

export async function logout() {
	await supabase.auth.signOut();
}
