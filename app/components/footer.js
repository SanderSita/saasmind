export default function Footer() {
	return (
		<>
			<div className="w-full h-10 show-lines"></div>
			<div className="border border-black w-full bg-[#EEEEEE] md:p-20 p-10">
				{/* small label */}
				<div className="flex items-center gap-2 text-[10px]">
					<div className="bg-black size-2.5  shrink-0"></div>
					<span className="tracking-tight leading-none mt-[2px]">
						SaaSminder
					</span>
				</div>

				{/* main footer grid */}
				<div className="grid md:grid-cols-4 grid-cols-1 gap-10 mt-12 text-lg">
					{/* Column 1 - Brand */}
					<div className="flex flex-col gap-3">
						<span className="text-3xl tracking-tight">
							SaaSminder
						</span>
						<p className="text-gray-500 text-sm font-extralight mt-2">
							An AI teammate for SaaS founders
						</p>
					</div>

					{/* Column 2 */}
					<div className="flex flex-col gap-1">
						<p className="text-xl tracking-tight">Product</p>
						<a
							href="#product"
							className="text-gray-500 cursor-pointer mt-2"
						>
							Use Cases
						</a>
						<a
							href="#usage"
							className="text-gray-500 cursor-pointer"
						>
							How to Use
						</a>
					</div>

					{/* Column 3 */}
					<div className="flex flex-col gap-1">
						<p className="text-xl tracking-tight">Resources</p>
						<a
							href="/privacy-policy"
							className="text-gray-500 cursor-pointer mt-2"
						>
							Privacy Policy
						</a>
						<a
							href="/terms-and-conditions"
							className="text-gray-500 cursor-pointer"
						>
							Terms of Service
						</a>
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
						<a
							href="mailto:info@saasminder.com"
							className="text-gray-500 cursor-pointer"
						>
							info@saasminder.com
						</a>
					</div>
				</div>

				{/* copyright row */}
				<div className="border border-black w-full p-4 text-sm text-gray-500 text-center mt-20">
					© {new Date().getFullYear()} SaaSminder. All rights
					reserved.
				</div>
			</div>
		</>
	);
}
