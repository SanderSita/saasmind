import {
	Sparkles,
	Zap,
	Target,
	TrendingUp,
	MessageSquare,
	Rocket,
} from "lucide-react";

export default function LandingPage({ onGetStarted }) {
	return (
		<div className="min-h-screen bg-linear-to-b from-white to-slate-200">
			{/* <nav className="fixed top-0 left-0 right-0 px-4 bz-50 text-black/80">
				<div className="mt-4 max-w-[350px] h-[40px] backdrop-blur-[20px] rounded-lg flex justify-between items-center overflow-hidden mx-auto animate-fade-in duration-300">
					<div className="bg-surface-glass bg-[#D8DBE2]/50 backdrop-blur-md flex h-full w-full justify-between items-center pl-5 pr-1">
						<div className="flex items-center pt-[1.5px] text-content-primary">
							<img
								src="/logo.svg"
								className="w-6 h-6 mr-2"
								alt="logo"
							/>
							<a
								className="transition-opacity duration-200 ease-out hover:opacity-60"
								href="/"
							>
								SaaSMind
							</a>
						</div>
						<div className="flex items-center">
							<div className="flex items-center gap-4 mr-4">
								<a
									className="text-content-tertiary text-xs font-regularplus tracking-wide leading-[1.45] hover:text-content-primary transition-colors duration-default ease-out"
									href="/waitlist"
								>
									Login
								</a>
							</div>
						</div>
					</div>
				</div>
			</nav> */}

			<main className="pt-24">
				<section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
					<div className="text-center max-w-4xl mx-auto">
						<div className="inline-flex items-center gap-2 bg-slate-900/5 px-4 py-2 rounded-full mb-8 border border-slate-200">
							<img
								src="/logo.svg"
								className="w-6 h-6"
								alt="logo"
							/>
							<span className="text-sm font-medium text-slate-700">
								Your AI Product Manager
							</span>
						</div>

						<h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
							Build Your SaaS
							<span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">
								Faster & Smarter
							</span>
						</h1>

						<p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
							Your personal AI assistant that remembers your
							entire SaaS context. Get instant help with building,
							marketing, content creation, and strategic
							decisions.
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
							<button
								onClick={onGetStarted}
								className="bg-slate-900 cursor-pointer text-white px-8 py-4 rounded-xl hover:bg-slate-800 transition-all font-semibold text-lg shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:scale-105 flex items-center gap-2"
							>
								Start Building
								<Rocket className="w-5 h-5" />
							</button>
							<button className="bg-white cursor-pointer text-slate-900 px-8 py-4 rounded-xl hover:bg-slate-50 transition-all font-semibold text-lg border-2 border-slate-200 hover:border-slate-300">
								Watch Demo
							</button>
						</div>

						<div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
								<span>Free (yes really)</span>
							</div>
						</div>
					</div>
				</section>

				<section className="max-w-7xl mx-auto px-6 py-20 bg-white rounded-3xl shadow-2xl shadow-slate-900/10 mx-6 mb-20">
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						<div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
							<div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
								<MessageSquare className="w-7 h-7 text-white" />
							</div>
							<h3 className="text-2xl font-bold text-slate-900 mb-4">
								Context-Aware Chat
							</h3>
							<p className="text-slate-600 leading-relaxed">
								Your AI remembers everything about your SaaS. No
								need to repeat yourself. Every conversation
								builds on previous context.
							</p>
						</div>

						<div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
							<div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
								<Zap className="w-7 h-7 text-white" />
							</div>
							<h3 className="text-2xl font-bold text-slate-900 mb-4">
								Instant Solutions
							</h3>
							<p className="text-slate-600 leading-relaxed">
								Get immediate answers for technical challenges,
								feature ideas, and implementation strategies
								tailored to your product.
							</p>
						</div>

						<div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
							<div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
								<Target className="w-7 h-7 text-white" />
							</div>
							<h3 className="text-2xl font-bold text-slate-900 mb-4">
								Marketing Strategy
							</h3>
							<p className="text-slate-600 leading-relaxed">
								Generate targeted marketing campaigns, social
								media posts, and content strategies that align
								with your SaaS vision.
							</p>
						</div>

						<div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
							<div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
								<TrendingUp className="w-7 h-7 text-white" />
							</div>
							<h3 className="text-2xl font-bold text-slate-900 mb-4">
								Product Management
							</h3>
							<p className="text-slate-600 leading-relaxed">
								Get guidance on prioritization, roadmapping, and
								strategic decisions like having an experienced
								PM on your team.
							</p>
						</div>

						<div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
							<div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
								<Sparkles className="w-7 h-7 text-white" />
							</div>
							<h3 className="text-2xl font-bold text-slate-900 mb-4">
								Idea Generation
							</h3>
							<p className="text-slate-600 leading-relaxed">
								Brainstorm features, explore market
								opportunities, and validate ideas with AI that
								understands your unique context.
							</p>
						</div>

						<div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
							<div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
								<Rocket className="w-7 h-7 text-white" />
							</div>
							<h3 className="text-2xl font-bold text-slate-900 mb-4">
								Launch Support
							</h3>
							<p className="text-slate-600 leading-relaxed">
								From MVP to scale, get continuous support for
								launches, updates, and growth strategies that
								drive results.
							</p>
						</div>
					</div>
				</section>

				<section
					id="how-it-works"
					className="max-w-7xl mx-auto px-6 py-20"
				>
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
							How It Works
						</h2>
						<p className="text-xl text-slate-600 max-w-2xl mx-auto">
							Three simple steps to your personal AI product
							assistant
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-12">
						<div className="text-center">
							<div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">
								1
							</div>
							<h3 className="text-2xl font-bold text-slate-900 mb-4">
								Tell Us About Your SaaS
							</h3>
							<p className="text-slate-600 leading-relaxed">
								Share your vision, target market, features, and
								goals. The AI learns your entire context in
								minutes.
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">
								2
							</div>
							<h3 className="text-2xl font-bold text-slate-900 mb-4">
								Ask Anything
							</h3>
							<p className="text-slate-600 leading-relaxed">
								Get help with coding, marketing, strategy, or
								content. Your AI remembers every conversation
								and builds on it.
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg">
								3
							</div>
							<h3 className="text-2xl font-bold text-slate-900 mb-4">
								Build & Launch Faster
							</h3>
							<p className="text-slate-600 leading-relaxed">
								Execute with confidence knowing you have an AI
								assistant that understands your product inside
								and out.
							</p>
						</div>
					</div>
				</section>

				<section className="max-w-5xl mx-auto px-6 py-20">
					<div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
							Ready to Build Smarter?
						</h2>
						<p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
							Join other SaaS builders who are shipping faster
							with their AI product assistant.
						</p>
						<button
							onClick={onGetStarted}
							className="bg-white text-slate-900 px-10 py-5 rounded-xl cursor-pointer hover:bg-slate-100 transition-all font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2"
						>
							Start Building
							<Rocket className="w-6 h-6" />
						</button>
					</div>
				</section>
			</main>

			<footer className="border-t border-slate-200 mt-20">
				<div className="max-w-7xl mx-auto px-6 py-12">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex items-center gap-2">
							<Sparkles className="w-6 h-6 text-slate-800" />
							<span className="text-lg font-bold text-slate-900">
								SaaSMind
							</span>
						</div>
						<div className="flex items-center gap-8 text-slate-600">
							<a
								href="#"
								className="hover:text-slate-900 transition-colors"
							>
								Privacy
							</a>
							<a
								href="#"
								className="hover:text-slate-900 transition-colors"
							>
								Terms
							</a>
							<a
								href="#"
								className="hover:text-slate-900 transition-colors"
							>
								Contact
							</a>
						</div>
						<p className="text-slate-500 text-sm">
							© 2025 SaaSMind. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
