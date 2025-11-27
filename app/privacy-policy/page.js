import Footer from "../components/footer";
import Header from "../components/header";

export default function PrivacyPolicyPage() {
	return (
		<div className="bg-[#EEEEEE] md:p-8 p-2 min-h-screen">
			{/* Header */}
			<Header />

			{/* Main */}
			<main className="max-w-6xl mx-auto md:py-16 py-8">
				<header className="text-center">
					<h1 className="text-5xl md:text-8xl tracking-tighter">
						Privacy Policy
					</h1>
					<p className="text-md md:text-lg text-gray-500 tracking-tight font-extralight mt-4">
						Last updated: November 27, 2025
					</p>
				</header>

				<article className="mt-12 border border-black p-8 bg-white">
					<section className="prose prose-md md:prose-lg max-w-none">
						<p>
							This Privacy Policy describes our policies regarding
							the collection, use, and disclosure of your
							information when you use the Service and explains
							your privacy rights and how the law protects you.
						</p>

						<p>
							By using the Service, you agree to the collection
							and use of information in accordance with this
							Privacy Policy. This Privacy Policy was originally
							generated with the help of the{" "}
							<a
								href="https://www.termsfeed.com/privacy-policy-generator/"
								target="_blank"
								rel="noreferrer"
								className="text-blue-600"
							>
								Privacy Policy Generator
							</a>
							.
						</p>

						<h2>Interpretation and Definitions</h2>
						<h3>Interpretation</h3>
						<p>
							Words with capitalized initials have meanings
							defined under the following conditions. These
							definitions apply whether they appear in singular or
							plural.
						</p>

						<h3>Definitions</h3>
						<p>For the purposes of this Privacy Policy:</p>
						<ul>
							<li>
								<strong>Account:</strong> means a unique account
								created for you to access our Service or parts
								of it.
							</li>
							<li>
								<strong>Affiliate:</strong> means an entity that
								controls, is controlled by, or is under common
								control with a party.
							</li>
						</ul>

						<h2>Collecting and Using Your Personal Data</h2>
						<h3>Types of Data Collected</h3>
						<h4>Personal Data</h4>
						<p>
							While using our Service, we may ask you to provide
							certain personally identifiable information.
						</p>
						<ul>
							<li>Email address</li>
							<li>Usage Data</li>
						</ul>
					</section>
				</article>

				<div className="mt-10">
					<Footer />
				</div>
			</main>
		</div>
	);
}
