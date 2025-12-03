import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/context/UserContext";
import { createClient } from "@/utils/supabase/server";
import { useUser } from "@/utils/supabase/server";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "SaaSminder",
	description: "Your AI Product Manager",
};

export default async function RootLayout({ children }) {
	let userData = null;
	const user = useUser();

	if (user) {
		const supabase = await createClient();
		const { data: profile } = await supabase
			.from("users")
			.select("*")
			.eq("auth_id", user.id)
			.single();

		// 3. Merge auth + profile into unified object
		userData = {
			email: user.email ?? null,
		};
	}

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<UserProvider initialUser={userData ?? undefined}>
					{children}
					<Toaster />
				</UserProvider>
			</body>
			<Analytics />
		</html>
	);
}
