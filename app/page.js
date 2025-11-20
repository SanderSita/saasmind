import { Atom } from "lucide-react";
import LoginBtn from "./components/login-btn";

export default async function LandingPage() {
	return (
		<div className="bg-[#EEEEEE] p-8 min-h-screen">
			{/* header */}
			<div className="w-full p-3 border border-black flex justify-between items-center text-xl">
				<div className="flex gap-2 ml-2 items-center">
					<Atom className="size-10" />
					<div className="flex gap-12 ml-8">
						<span>Cloud Sessions</span>
						<span>Agents API</span>
						<span>Playground</span>
						<span>Docs</span>
					</div>
				</div>

				<LoginBtn
					btn={
						<div className="bg-slate-900 cursor-pointer text-white px-8 py-4">
							Get Started
						</div>
					}
					isSignin={false}
				/>
			</div>

			<div className="w-full h-10 show-lines"></div>

			{/* main */}
			<div className="border border-black w-full flex flex-col justify-center text-center">
				<div className="flex items-center gap-2 mt-28 text-[10px] justify-center">
					<div className="bg-black size-2.5 rounded-full shrink-0"></div>
					<span className="tracking-tight leading-none mt-[2px]">
						NEW ANNOUNCEMENT ON X –{" "}
						<span className="text-blue-500">READ MORE</span>
					</span>
				</div>

				<h1 className="text-8xl tracking-tighter mt-10">
					The browser engine for<br></br>autonomous AI
				</h1>
				<p className="text-lg text-gray-500 tracking-tight font-extralight mt-8">
					Brixel runs, controls, and scales browsers in the cloud -
					built for developers<br></br>creating agents, scrapers and
					automation at massive scale.
				</p>

				<div className="flex gap-3 justify-center mt-8 game-font text-xl">
					<LoginBtn
						btn={
							<div className="bg-slate-900 cursor-pointer text-white px-8 py-4">
								Launch Playground
							</div>
						}
						isSignin={false}
					/>
					<div className="relative inline-flex px-10 py-3 game-font cursor-pointer">
						<span className="my-auto">Read Docs</span>

						{/* Top-left corner */}
						<span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black z-20"></span>

						{/* Top-right corner */}
						<span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black z-20"></span>

						{/* Bottom-left corner */}
						<span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black z-20"></span>

						{/* Bottom-right corner */}
						<span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black z-20"></span>

						<span className="absolute w-full bottom-0 left-0 border h-full border-gray-300"></span>
					</div>
				</div>

				<img src="/images/hero-1.png" className="mt-26" />
			</div>

			<div className="w-full h-10 show-lines"></div>

			<div className="grid grid-cols-3 w-full border border-black">
				<div className="border-r border-r-black p-7">
					<p className="text-4xl">{"<1s"}</p>
					<p className="text-xl text-gray-400 mt-4">
						From Request to Render
					</p>
				</div>
				<div className="border-r border-r-black p-7">
					<p className="text-4xl">{"300,000+"}</p>
					<p className="text-xl text-gray-400 mt-4">
						Cloud Sessions Deployed
					</p>
				</div>
				<div className="p-7">
					<p className="text-4xl">{"98B+"}</p>
					<p className="text-xl text-gray-400 mt-4">
						Browser Events Processed
					</p>
				</div>
			</div>

			<div className="border-x border-b border-black w-full">
				<div className="p-20 ">
					<div className="flex items-center gap-2 text-[10px]">
						<div className="bg-black size-2.5 rounded-full shrink-0"></div>
						<span className="tracking-tight leading-none mt-[2px]">
							USE CASES
						</span>
					</div>
					<h2 className="text-8xl tracking-tighter mt-10">
						What Developers<br></br>Power with Brixel
					</h2>
					<p className="text-xl text-gray-400 font-extralight mt-8 lea">
						From smart clawlers to real-time web agents, Brixel runs
						your automations<br></br>inside fully managed browsers
						-- fast, scalable and built for the modern AI stack.
					</p>
				</div>

				<img src="/images/hero-1.png" className="w-full" />
			</div>

			{/* HOW TO USE SECTION */}
			<div className="p-20 border-x border-b border-black w-full bg-[#EEEEEE]">
				<div className="flex items-center gap-2 text-[10px]">
					<div className="bg-black size-2.5 rounded-full shrink-0"></div>
					<span className="tracking-tight leading-none mt-[2px]">
						HOW TO USE
					</span>
				</div>

				<h2 className="text-8xl tracking-tighter mt-10">
					Get Started<br></br>in Minutes
				</h2>

				<p className="text-xl text-gray-400 font-extralight mt-8">
					Using Brixel is simple — deploy cloud browsers, send
					commands, and<br></br>
					start automating with powerful APIs built for AI-driven
					workflows.
				</p>

				{/* Steps */}
				<div className="grid grid-cols-3 border border-black mt-16">
					{/* Step 1 */}
					<div className="border-r border-black p-10">
						<p className="text-3xl tracking-tight">01</p>
						<p className="text-2xl mt-4">Create a Session</p>
						<p className="text-gray-500 mt-4 text-lg font-extralight">
							Launch a high-performance cloud browser by calling
							the Sessions API or using the Playground UI.
						</p>
					</div>

					{/* Step 2 */}
					<div className="border-r border-black p-10">
						<p className="text-3xl tracking-tight">02</p>
						<p className="text-2xl mt-4">Send Commands</p>
						<p className="text-gray-500 mt-4 text-lg font-extralight">
							Navigate, click, scrape, or evaluate pages using
							simple, structured API requests — no setup required.
						</p>
					</div>

					{/* Step 3 */}
					<div className="p-10">
						<p className="text-3xl tracking-tight">03</p>
						<p className="text-2xl mt-4">Scale Automatically</p>
						<p className="text-gray-500 mt-4 text-lg font-extralight">
							Run hundreds or thousands of concurrent browser
							sessions with Brixel’s fully managed infrastructure.
						</p>
					</div>
				</div>

				{/* Optional CTA */}
				<div className="flex gap-3 justify-start mt-14 game-font text-xl">
					<div className="bg-slate-900 cursor-pointer text-white px-8 py-4">
						Start a Session
					</div>

					<div className="relative inline-flex px-10 py-3 cursor-pointer">
						<span className="my-auto">View API Docs</span>

						{/* Corners */}
						<span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black z-20"></span>
						<span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black z-20"></span>
						<span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black z-20"></span>
						<span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black z-20"></span>

						<span className="absolute w-full bottom-0 left-0 border h-full border-gray-300"></span>
					</div>
				</div>
			</div>

			{/* FOOTER */}
			<div className="w-full h-10 show-lines"></div>
			<div className="border border-black w-full bg-[#EEEEEE] p-20">
				{/* small label */}
				<div className="flex items-center gap-2 text-[10px]">
					<div className="bg-black size-2.5 rounded-full shrink-0"></div>
					<span className="tracking-tight leading-none mt-[2px]">
						BRIXEL
					</span>
				</div>

				{/* main footer grid */}
				<div className="grid grid-cols-4 gap-10 mt-12 text-lg">
					{/* Column 1 - Brand */}
					<div className="flex flex-col gap-3">
						<span className="text-3xl tracking-tight">Brixel</span>
						<p className="text-gray-500 text-sm font-extralight mt-2">
							The browser engine for autonomous AI — fast,
							scalable, and built for developers.
						</p>
					</div>

					{/* Column 2 */}
					<div className="flex flex-col gap-1">
						<p className="text-xl tracking-tight">Product</p>
						<span className="text-gray-500 cursor-pointer mt-2">
							Cloud Sessions
						</span>
						<span className="text-gray-500 cursor-pointer">
							Agents API
						</span>
						<span className="text-gray-500 cursor-pointer">
							Playground
						</span>
						<span className="text-gray-500 cursor-pointer">
							Pricing
						</span>
					</div>

					{/* Column 3 */}
					<div className="flex flex-col gap-1">
						<p className="text-xl tracking-tight">Resources</p>
						<span className="text-gray-500 cursor-pointer mt-2">
							Docs
						</span>
						<span className="text-gray-500 cursor-pointer">
							API Reference
						</span>
						<span className="text-gray-500 cursor-pointer">
							Status
						</span>
						<span className="text-gray-500 cursor-pointer">
							Examples
						</span>
					</div>

					{/* Column 4 */}
					<div className="flex flex-col gap-1">
						<p className="text-xl tracking-tight">Company</p>
						<span className="text-gray-500 cursor-pointer mt-2">
							About
						</span>
						<span className="text-gray-500 cursor-pointer">
							Blog
						</span>
						<span className="text-gray-500 cursor-pointer">
							X (Twitter)
						</span>
						<span className="text-gray-500 cursor-pointer">
							Contact
						</span>
					</div>
				</div>

				{/* copyright row */}
				<div className="border border-black w-full p-4 text-sm text-gray-500 text-center mt-20">
					© {new Date().getFullYear()} Brixel Technologies. All rights
					reserved.
				</div>
			</div>
		</div>
	);
}
