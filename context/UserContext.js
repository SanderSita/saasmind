"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const UserContext = createContext(null);

export function UserProvider({ children, initialUser }) {
	const [user, setUser] = useState(initialUser || null);

	useEffect(() => {
		// Keep user in sync with Supabase session changes (login/logout)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (!session?.user) {
				setUser(null);
				return;
			}

			// 1. Get the auth user (id + email)
			const authUser = session.user;

			// 2. Fetch their profile from your `users` table
			const { data: profile } = await supabase
				.from("users")
				.select("*")
				.eq("auth_id", authUser.id)
				.single();

			// 3. Merge auth + profile into unified object
			const userData = {
				email: authUser.email ?? null,
			};

			setUser(userData);
		});

		return () => subscription.unsubscribe();
	}, []);

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function getUser() {
	return useContext(UserContext);
}

export function logout() {
	supabase.auth.signOut();
}
