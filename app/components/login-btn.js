"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

export default function LoginBtn({ btn, isSignin }) {
	return (
		<Dialog>
			<DialogTrigger>{btn}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{isSignin ? "Login" : "Get Started"}
					</DialogTitle>
					<DialogDescription>
						Sign in with Google, or use your email and password.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{/* Google sign-in (shadcn Button) */}
					<button
						type="button"
						className="inline-flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
						onClick={() => {
							// replace with your real OAuth endpoint
							window.location.href = "/api/auth/google";
						}}
					>
						<img
							src="/google.svg"
							alt="Google Logo"
							className="mr-2 h-4 w-4"
						/>
						Continue with Google
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
								alert("Please enter both email and password.");
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
									alert(text || "Login failed");
								}
							} catch (err) {
								alert("Network error");
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
								className="w-full rounded-md border px-3 py-2 text-sm"
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
								className="w-full rounded-md border px-3 py-2 text-sm"
							/>
						</div>

						<div>
							<button
								type="submit"
								className="w-full cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-95"
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
