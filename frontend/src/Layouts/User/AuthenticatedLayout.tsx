import { Outlet } from "react-router-dom";
import Sidebar from "@/Components/Sidebar/Sidebar";
import Header from "@/Components/Header/Header";
import { useState } from "react";

export default function AuthenticatedLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Sidebar - sempre visível em telas grandes */}
			<div className="hidden lg:block fixed left-0 top-0 h-screen">
				<Sidebar />
			</div>

			{/* Sidebar mobile - toggle */}
			{sidebarOpen && (
				<div className="lg:hidden fixed inset-0 z-50">
					<div
						className="fixed inset-0 bg-black/50"
						onClick={() => setSidebarOpen(false)}
					></div>
					<div className="fixed left-0 top-0 bottom-0 z-50">
						<Sidebar />
					</div>
				</div>
			)}

			{/* Main Content */}
			<div className="flex-1 flex flex-col lg:ml-64">
				<Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
				<main className="flex-1 overflow-y-auto bg-gray-50">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
