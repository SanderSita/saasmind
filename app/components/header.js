"use client";

import Link from "next/link";
import LoginBtn from "./login-btn";
import { useUser } from "@/context/UserContext";

export default function Header() {
	const user = useUser();

	return (
		<div className="w-full p-3 border border-black flex justify-between items-center md:text-xl text-lg">
			<div className="flex gap-2 md:ml-2 items-center cursor-pointer">
				{/* <Atom className="size-10" /> */}
				<Link href="/">
					<img src="/logo.svg" className="w-14 h-14" alt="logo" />
				</Link>

				<div className="gap-12 ml-8 hidden md:flex">
					<a href="#product">Product</a>
					<a href="#usage">Usage</a>
				</div>
			</div>

			{user ? (
				<div className="flex items-center gap-2">
					<Link href="/dashboard">
						<div className="bg-slate-900 cursor-pointer text-white md:px-8 px-4 md:py-4 py-2">
							Dashboard
						</div>
					</Link>
				</div>
			) : (
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
			)}
		</div>
	);
}
