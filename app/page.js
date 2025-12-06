import LoginBtn from "./components/login-btn";
import Footer from "./components/footer";
import Header from "./components/header";

export default async function LandingPage() {
	return (
		<div className="bg-[#EEEEEE] md:p-8 p-2 min-h-screen">
			{/* header */}
			<Header />

			<div className="w-full h-10 show-lines"></div>

			<a
				href="https://www.producthunt.com/products/saasminder?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-saasminder"
				target="_blank"
				className="fixed bottom-5 right-5"
			>
				<img
					src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1046284&theme=light&t=1764934596053"
					alt="SaaSminder - Chat&#0032;with&#0032;AI&#0032;that&#0032;remembers&#0032;your&#0032;SaaS | Product Hunt"
					style={{ width: "250px", height: "54px" }}
					width="250"
					height="54"
				/>
			</a>

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
					SaaSminder is an AI teammate for SaaS founders. It remembers
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

					<a
						href="#usage"
						className="relative inline-flex px-10 py-3 game-font cursor-pointer w-full md:w-auto"
					>
						<span className="my-auto mx-auto">Learn More</span>

						{/* corners */}
						<span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black z-20"></span>
						<span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black z-20"></span>
						<span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black z-20"></span>
						<span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black z-20"></span>

						<span className="absolute w-full bottom-0 left-0 border h-full border-gray-300"></span>
					</a>
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
					<p className="md:text-4xl text-2xl">{"300+"}</p>
					<p className="md:text-xl text-lg text-gray-400 mt-4">
						Projects Using SaaSminder
					</p>
				</div>
				<div className="md:p-7 p-3">
					<p className="md:text-4xl text-2xl">{"50K+"}</p>
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
						What SaaS Founders<br></br>Build with SaaSminder
					</h2>
					<p className="md:text-xl text-md text-gray-400 font-extralight mt-8 lea">
						Idea validation, launch copy, growth experiments, and
						product docs.<br></br>SaaSminder keeps your product
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
					Add your project, add a few notes, and ask SaaSminder to
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
							Tell SaaSminder about your product: paste a
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
			<Footer />
		</div>
	);
}
