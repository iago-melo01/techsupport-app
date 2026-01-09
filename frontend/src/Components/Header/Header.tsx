import { Menu, Search, Bell, HelpCircle } from "lucide-react";
import { useAuthContext } from "@/Context/AuthContext";

interface HeaderProps {
	onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
	const { user } = useAuthContext();

	return (
		<header className="bg-gray-100 border-b border-gray-200 h-16 flex items-center justify-between px-6">
			<div className="flex items-center gap-4">
				<button
					onClick={onMenuToggle}
					className="lg:hidden p-2 hover:bg-gray-200 rounded-lg transition-colors"
				>
					<Menu size={24} className="text-gray-700" />
				</button>
				<h2 className="text-lg font-semibold text-gray-800">TechSupport Pro</h2>
			</div>

			<div className="flex items-center gap-4">
				<button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
					<Search size={20} className="text-gray-600" />
				</button>
				<button className="p-2 hover:bg-gray-200 rounded-lg transition-colors relative">
					<Bell size={20} className="text-gray-600" />
					<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
				</button>
				<button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
					<HelpCircle size={20} className="text-gray-600" />
				</button>
				<div className="flex items-center gap-2 pl-4 border-l border-gray-300">
					<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
						{user?.name?.charAt(0).toUpperCase() || "U"}
					</div>
					<span className="text-sm font-medium text-gray-700">
						{user?.name || "Usuário"}
					</span>
				</div>
			</div>
		</header>
	);
}
