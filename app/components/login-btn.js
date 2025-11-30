"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { useState, cloneElement } from "react";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginBtn({ btn, isSignin }) {
	const [googleLoading, setGoogleLoading] = useState(false);

	const user = useUser();

	const handleGoogleSignup = async () => {
		try {
			setGoogleLoading(true);
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/v1/callback?next=/dashboard`,
				},
			});
			if (error) {
				toast.error(error.message);

				setGoogleLoading(false);
				return;
			}
			if (data?.url) {
				window.location.href = data.url;
			} else {
				setGoogleLoading(false);
			}
		} catch (err) {
			console.error(err);
			toast.error("Unable to start Google sign up");
			setGoogleLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		try {
			setGoogleLoading(true);
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/v1/callback?next=/dashboard`,
				},
			});
			if (error) {
				toast.error(error.message);
				setGoogleLoading(false);
				return;
			}
			if (data?.url) {
				window.location.href = data.url;
			} else {
				setGoogleLoading(false);
			}
		} catch (err) {
			toast.error("Unable to start Google login");
			setGoogleLoading(false);
		}
	};
	if (user) {
		// Return a cloned button element with an onClick that preserves any existing handler
		// and then navigates to the dashboard.
		return <Link href="/dashboard">{cloneElement(btn)}</Link>;
	}

	return (
		<Dialog>
			<DialogTrigger>{btn}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{isSignin ? "Login" : "Get Started"}
					</DialogTitle>
					<DialogDescription>
						Sign {isSignin ? "in" : "up"} with Google, or use your
						email and password.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{/* Google sign-in (shadcn Button) */}
					<button
						type="button"
						onClick={
							isSignin ? handleGoogleLogin : handleGoogleSignup
						}
						disabled={googleLoading}
						className="w-full border border-gray-300 text-gray-700 py-2 px-4 hover:bg-gray-50 transition duration-200 disabled:opacity-50 cursor-pointer mb-6 flex items-center justify-center gap-2"
					>
						{googleLoading ? null : (
							<img
								src="/svg/google.svg"
								alt="Google"
								className="w-5 h-5"
							/>
						)}
						{googleLoading ? "Redirecting..." : "Login with Google"}
					</button>

					{/* separator */}
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								or
							</span>
						</div>
					</div>

					{/* Email / Password form (using shadcn Input/Label styles) */}
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							const form = e.target;
							const email = form.email.value.trim();
							const password = form.password.value;

							if (!email || !password) {
								toast.error("Email and password are required.");
								return;
							}

							try {
								const res = await fetch(
									isSignin
										? "/api/auth/login"
										: "/api/auth/signup",
									{
										method: "POST",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify({
											email,
											password,
										}),
									}
								);

								if (res.ok) {
									window.location.assign("/dashboard");
								} else {
									const text = await res.text();
									toast.error(text || "Login failed");
								}
							} catch (err) {
								toast.error("Network error");
							}
						}}
						className="grid gap-3"
					>
						<div className="grid gap-1">
							<label
								htmlFor="email"
								className="text-sm font-medium"
							>
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								className="w-full border px-3 py-2 text-sm"
							/>
						</div>

						<div className="grid gap-1">
							<label
								htmlFor="password"
								className="text-sm font-medium"
							>
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								className="w-full border px-3 py-2 text-sm"
							/>
						</div>

						<div>
							<button
								type="submit"
								className="w-full cursor-pointer bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-95"
							>
								{isSignin ? "Sign in" : "Create Account"}
							</button>
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
