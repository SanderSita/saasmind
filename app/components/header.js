"use client";

import Link from "next/link";

export default function Header() {
	const onGetStarted = () => {};

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
			<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2">
					<img src="/logo.svg" className="w-12 h-12" alt="logo" />
					<span className="text-xl font-bold text-slate-900">
						SaaSMind
					</span>
				</Link>
				<div className="hidden md:flex items-center gap-8">
					<a
						href="#features"
						className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
					>
						Features
					</a>
					<a
						href="#how-it-works"
						className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
					>
						How it Works
					</a>
				</div>
				<div className="flex items-center gap-4">
					<button
						onClick={onGetStarted}
						className="text-slate-600 cursor-pointer hover:text-slate-900 transition-colors font-medium"
					>
						Sign In
					</button>
					<button
						onClick={onGetStarted}
						className="bg-slate-900 cursor-pointer text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-all font-medium shadow-lg shadow-slate-900/10 hover:shadow-xl"
					>
						Get Started
					</button>
				</div>
			</div>
		</nav>
	);
}
