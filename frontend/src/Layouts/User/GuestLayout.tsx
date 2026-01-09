import { Outlet } from "react-router-dom";

export default function GuestLayout() {
	return (
		<div className="flex flex-col min-h-screen bg-gray-50">
			<header className="bg-white shadow-sm">
				<div className="container mx-auto px-4 py-4">
					<h1 className="text-xl font-bold text-gray-800">TechSupport Pro</h1>
				</div>
			</header>
			<main className="flex-grow">
				<Outlet />
			</main>
			<footer className="bg-white border-t mt-auto py-4">
				<div className="container mx-auto px-4 text-center text-gray-600 text-sm">
					TechSupport Pro © 2024
				</div>
			</footer>
		</div>
	);
}
