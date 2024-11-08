import { Link } from "wouter";

export const NotFound: React.FC = () => {
	return <>
		<article className="flex flex-col items-center w-full h-full p-10">
			<header>
				<h1 className="text-xl">404 - Page Not Found</h1>
			</header>
			<section className="flex flex-col items-center">
				<p>Sorry, the page you are looking for does not exist.</p>
				<p>Go back to the <Link href="/" className="text-blue-600 hover:underline font-bold">home page</Link>.</p>
			</section>
		</article>
	</>
}