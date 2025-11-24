import { Atom } from "lucide-react";
import LoginBtn from "./components/login-btn";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
	return (
		<div className="bg-[#EEEEEE] md:p-8 p-2 min-h-screen">
			{/* header */}
			<div className="w-full p-3 border border-black flex justify-between items-center md:text-xl text-lg">
				<div className="flex gap-2 md:ml-2 items-center">
					{/* <Atom className="size-10" /> */}
					<img src="/logo.svg" className="w-14 h-14" alt="logo" />

					<div className="gap-12 ml-8 hidden md:flex">
						<a href="#product">Product</a>
						<a href="#usage">Usage</a>
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
			<div className="border border-black w-full flex flex-col justify-center text-center">
				<div className="flex items-center gap-2 md:mt-28 mt-14 text-[12px] justify-center">
					<div className="bg-black size-2.5  shrink-0"></div>
					<span className="tracking-tight leading-none mt-[2px]">
						NOW USING{" "}
						<a
							href="https://openai.com/index/introducing-gpt-oss/"
							className="text-blue-500"
							target="_blank"
							rel="noopener noreferrer"
						>
							GPT-OSS-120B
						</a>
					</span>
				</div>

				<h1 className="text-5xl md:text-8xl tracking-tighter mt-10">
					Talk to AI that<br></br>knows your SaaS
				</h1>

				<p className="text-md md:text-lg text-gray-500 tracking-tight font-extralight mt-8 md:w-1/2 w-3/4 mx-auto">
					SaaSmind is an AI teammate for SaaS founders. It remembers
					your product context, drafts landing copy, proposes
					roadmaps, and helps with marketing, so you ship faster.
				</p>

				<div className="flex md:flex-row flex-col gap-3 justify-center mt-8 game-font text-xl w-3/4 mx-auto">
					<LoginBtn
						btn={
							<div className="bg-slate-900 cursor-pointer text-white px-8 py-4">
								Open Workspace
							</div>
						}
						isSignin={false}
					/>

					<div className="relative inline-flex px-10 py-3 game-font cursor-pointer w-full md:w-auto">
						<span className="my-auto mx-auto">Read Docs</span>

						{/* corners */}
						<span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black z-20"></span>
						<span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black z-20"></span>
						<span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black z-20"></span>
						<span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black z-20"></span>

						<span className="absolute w-full bottom-0 left-0 border h-full border-gray-300"></span>
					</div>
				</div>

				<img src="/images/context.png" className="mt-26" />
			</div>

			<div className="w-full h-10 show-lines"></div>

			<div className="grid grid-cols-3 w-full border border-black">
				<div className="border-r border-r-black md:p-7 p-3">
					<p className="md:text-4xl text-2xl">{"<1w"}</p>
					<p className="md:text-xl text-lg text-gray-400 mt-4">
						Time to MVP
					</p>
				</div>
				<div className="border-r border-r-black md:p-7 p-3">
					<p className="md:text-4xl text-2xl">{"3,000+"}</p>
					<p className="md:text-xl text-lg text-gray-400 mt-4">
						Projects Using SaaSmind
					</p>
				</div>
				<div className="md:p-7 p-3">
					<p className="md:text-4xl text-2xl">{"1M+"}</p>
					<p className="md:text-xl text-lg text-gray-400 mt-4">
						AI Actions Generated
					</p>
				</div>
			</div>

			<div className="border-x border-b border-black w-full" id="product">
				<div className="md:p-20 p-10">
					<div className="flex items-center gap-2 text-[10px]">
						<div className="bg-black size-2.5  shrink-0"></div>
						<span className="tracking-tight leading-none mt-[2px]">
							USE CASES
						</span>
					</div>
					<h2 className="text-5xl md:text-8xl tracking-tighter mt-10">
						What SaaS Founders<br></br>Build with SaaSmind
					</h2>
					<p className="md:text-xl text-md text-gray-400 font-extralight mt-8 lea">
						Idea validation, launch copy, growth experiments, and
						product docs.<br></br>SaaSmind keeps your product
						context in one place so you move faster and ship with
						clarity.
					</p>
				</div>

				<img src="/images/chat.png" className="w-full" />
			</div>

			{/* HOW TO USE SECTION */}
			<div
				className="md:p-20 p-10 border-x border-b border-black w-full bg-[#EEEEEE]"
				id="usage"
			>
				<div className="flex items-center gap-2 text-[10px]">
					<div className="bg-black size-2.5 shrink-0"></div>
					<span className="tracking-tight leading-none mt-[2px]">
						HOW TO USE
					</span>
				</div>

				<h2 className="md:text-8xl text-5xl tracking-tighter mt-10">
					Get Started<br></br>in Minutes
				</h2>

				<p className="md:text-xl text-md text-gray-400 font-extralight mt-8">
					Add your project, add a few notes, and ask SaaSmind to
					generate landing copy, feature ideas, marketing plans, and
					more.
				</p>

				{/* Steps */}
				<div className="grid md:grid-cols-3 grid-cols-1 border border-black mt-16">
					{/* Step 1 */}
					<div className="md:border-r border-b md:border-b-[#eeeeee] border-black md:p-10 p-3">
						<p className="md:text-3xl text-xl tracking-tight">01</p>
						<p className="md:text-2xl text-lg mt-4">
							Add Your Product
						</p>
						<p className="text-gray-500 mt-4 text-lg font-extralight">
							Tell SaaSmind about your product: paste a
							description or any existing copy.
						</p>
					</div>

					{/* Step 2 */}
					<div className="md:border-r border-b md:border-b-[#eeeeee] border-black md:p-10 p-3">
						<p className="md:text-3xl text-xl tracking-tight">02</p>
						<p className="md:text-2xl text-lg mt-4">Ask Anything</p>
						<p className="text-gray-500 mt-4 text-lg font-extralight">
							Request landing copy, feature ideas, growth
							experiments, or marketing assets tailored to your
							product context.
						</p>
					</div>

					{/* Step 3 */}
					<div className="md:p-10 p-3">
						<p className="md:text-3xl text-xl tracking-tight">03</p>
						<p className="md:text-2xl text-lg mt-4">
							Ship & Iterate
						</p>
						<p className="text-gray-500 mt-4 text-lg font-extralight">
							Add new context as your product evolves, and get
							fresh ideas and assets to fuel your growth.
						</p>
					</div>
				</div>

				{/* Optional CTA */}
				<div className="flex gap-3 justify-start mt-14 text-xl">
					<LoginBtn
						btn={
							<p className="bg-slate-900 cursor-pointer text-white px-8 py-4">
								<span className="game-font">Start</span> (
								<span className="fame-font">it</span>'
								<span className="game-font">s free</span>)
							</p>
						}
						isSignin={false}
					/>
				</div>
			</div>

			{/* FOOTER */}
			<div className="w-full h-10 show-lines"></div>
			<div className="border border-black w-full bg-[#EEEEEE] md:p-20 p-10">
				{/* small label */}
				<div className="flex items-center gap-2 text-[10px]">
					<div className="bg-black size-2.5  shrink-0"></div>
					<span className="tracking-tight leading-none mt-[2px]">
						SAASMIND
					</span>
				</div>

				{/* main footer grid */}
				<div className="grid md:grid-cols-4 grid-cols-2 gap-10 mt-12 text-lg">
					{/* Column 1 - Brand */}
					<div className="flex flex-col gap-3">
						<span className="text-3xl tracking-tight">
							SaaSmind
						</span>
						<p className="text-gray-500 text-sm font-extralight mt-2">
							An AI teammate for SaaS founders
						</p>
					</div>

					{/* Column 2 */}
					<div className="flex flex-col gap-1">
						<p className="text-xl tracking-tight">Product</p>
						<span className="text-gray-500 cursor-pointer mt-2">
							Use Cases
						</span>
						<span className="text-gray-500 cursor-pointer">
							How to Use
						</span>
					</div>

					{/* Column 3 */}
					<div className="flex flex-col gap-1">
						<p className="text-xl tracking-tight">Resources</p>
						<span className="text-gray-500 cursor-pointer mt-2">
							Privacy Policy
						</span>
						<span className="text-gray-500 cursor-pointer">
							Terms of Service
						</span>
					</div>

					{/* Column 4 */}
					<div className="flex flex-col gap-1">
						<p className="text-xl tracking-tight">Company</p>
						<a
							href="/about"
							className="text-gray-500 cursor-pointer mt-2"
						>
							About
						</a>
						<span className="text-gray-500 cursor-pointer">
							Contact
						</span>
					</div>
				</div>

				{/* copyright row */}
				<div className="border border-black w-full p-4 text-sm text-gray-500 text-center mt-20">
					© {new Date().getFullYear()} SaaSmind. All rights reserved.
				</div>
			</div>
		</div>
	);
}
