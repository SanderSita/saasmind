import { Atom } from "lucide-react";
import LoginBtn from "../components/login-btn";
import { Button } from "@/components/ui/button";

export default async function AboutPage() {
	return (
		<div className="bg-[#EEEEEE] md:p-8 p-2 min-h-screen">
			{/* header */}
			<div className="w-full p-3 border border-black flex justify-between items-center md:text-xl text-lg">
				<div className="flex gap-2 md:ml-2 items-center">
					<img src="/logo.svg" className="w-14 h-14" alt="logo" />

					<div className="gap-12 ml-8 hidden md:flex">
						<a href="/">Home</a>
						<a href="/about">About</a>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<LoginBtn
						btn={
							<div className="bg-transparent text-black cursor-pointer md:px-8 md:py-4 md:outline md:outline-gray-300 -outline-offset-1">
								Login
							</div>
						}
						isSignin={true}
					/>

					{/* Signup Button */}
					<LoginBtn
						btn={
							<div className="bg-slate-900 cursor-pointer text-white md:px-8 px-4 md:py-4 py-2">
								Get Started
							</div>
						}
						isSignin={false}
					/>
				</div>
			</div>

			<div className="w-full h-10 show-lines"></div>

			{/* main */}
			<div className="border border-black w-full flex flex-col justify-center text-center p-10">
				<div className="flex items-center gap-2 md:mt-8 mt-6 text-[12px] justify-center">
					<div className="bg-black size-2.5  shrink-0"></div>
					<span className="tracking-tight leading-none mt-0.5">
						ABOUT
					</span>
				</div>

				<h1 className="text-5xl md:text-6xl tracking-tighter mt-6">
					About SaaSminder
				</h1>

				<p className="text-md md:text-lg text-gray-500 tracking-tight font-extralight mt-6 md:w-1/2 w-3/4 mx-auto">
					SaaSminder is an AI teammate built for SaaS founders and
					teams. We combine your product context with powerful LLMs so
					you get tailored copy, product ideas, and growth
					experiments, all in one workspace.
				</p>

				<div className="md:w-2/3 w-11/12 mx-auto text-left mt-8">
					<h2 className="text-2xl md:text-4xl tracking-tight">
						My Mission
					</h2>
					<p className="text-gray-500 mt-4 text-lg font-extralight">
						I believe founders should spend time building, not
						rewriting docs or hunting for context. SaaSminder
						remembers what matters to your product and helps you
						ship with clarity and speed.
					</p>

					<h3 className="mt-8 text-xl md:text-2xl">Team</h3>

					{/* Twitter/X profile card for single team member */}
					<div className="mt-4">
						<a
							href="https://x.com/sander_sita"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-4 border border-black p-4 rounded-md bg-white hover:shadow-md"
						>
							{/* profile image */}
							<img
								src="https://pbs.twimg.com/profile_images/1986109666938548224/gsdh31JP_400x400.jpg"
								alt="profile"
								className="w-20 h-20 rounded-full object-cover"
							/>

							<div className="flex flex-col">
								<span className="font-semibold text-lg">
									SanderSita
								</span>
								<span className="text-gray-500">
									@sander_sita
								</span>
							</div>

							<div className="ml-4">
								{/* Inline X logo (simple stylized X) */}
								<img
									src="https://www.freepnglogos.com/uploads/twitter-x-logo-png/twitter-x-logo-png-9.png"
									alt="X Logo"
									className="w-6 h-6"
								/>
							</div>
						</a>

						<p className="text-gray-500 mt-4 text-lg font-extralight">
							A solo founder
						</p>
					</div>

					<div className="flex gap-3 justify-start mt-8 text-xl">
						<LoginBtn
							btn={
								<p className="bg-slate-900 cursor-pointer text-white px-8 py-4">
									Open Workspace
								</p>
							}
							isSignin={false}
						/>

						<a
							href="/"
							className="relative inline-flex px-10 py-3 game-font cursor-pointer w-full md:w-auto"
						>
							<span className="my-auto mx-auto">Back Home</span>

							{/* corners */}
							<span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black z-20"></span>
							<span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black z-20"></span>
							<span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black z-20"></span>
							<span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black z-20"></span>

							<span className="absolute w-full bottom-0 left-0 border h-full border-gray-300"></span>
						</a>
					</div>
				</div>
			</div>

			<div className="w-full h-10 show-lines"></div>

			{/* Footer (copied from home to keep consistent styling) */}
			<div className="border border-black w-full bg-[#EEEEEE] md:p-20 p-10">
				<div className="flex items-center gap-2 text-[10px]">
					<div className="bg-black size-2.5  shrink-0"></div>
					<span className="tracking-tight leading-none mt-0.5">
						SaaSminder
					</span>
				</div>

				<div className="grid md:grid-cols-4 grid-cols-2 gap-10 mt-12 text-lg">
					<div className="flex flex-col gap-3">
						<span className="text-3xl tracking-tight">
							SaaSminder
						</span>
						<p className="text-gray-500 text-sm font-extralight mt-2">
							An AI teammate for SaaS founders
						</p>
					</div>

					<div className="flex flex-col gap-1">
						<p className="text-xl tracking-tight">Product</p>
						<a
							href="#"
							className="text-gray-500 cursor-pointer mt-2"
						>
							Use Cases
						</a>
						<a href="#" className="text-gray-500 cursor-pointer">
							How to Use
						</a>
					</div>

					<div className="flex flex-col gap-1">
						<p className="text-xl tracking-tight">Resources</p>
						<a
							href="#"
							className="text-gray-500 cursor-pointer mt-2"
						>
							Privacy Policy
						</a>
						<a href="#" className="text-gray-500 cursor-pointer">
							Terms of Service
						</a>
					</div>

					<div className="flex flex-col gap-1">
						<p className="text-xl tracking-tight">Company</p>
						<a
							href="/about"
							className="text-gray-500 cursor-pointer mt-2"
						>
							About
						</a>
						<a href="#" className="text-gray-500 cursor-pointer">
							Contact
						</a>
					</div>
				</div>

				<div className="border border-black w-full p-4 text-sm text-gray-500 text-center mt-20">
					© {new Date().getFullYear()} SaaSminder. All rights
					reserved.
				</div>
			</div>
		</div>
	);
}
