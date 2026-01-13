import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, List, User, LogOut, Users2 } from "lucide-react";
import { useAuthContext } from "@/Context/AuthContext";
import { routes } from "@/Router/routes";
import { removeToken } from "@/Lib/Token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/Modules/Auth/Services/Mutations/logout";

interface MenuItem {
	id: number;
	label: string;
	icon: React.ReactNode;
	route: string;
}

export default function Sidebar() {
	const location = useLocation();
	const { user } = useAuthContext();
	const navigate = useNavigate();

	const menuItems: MenuItem[] = [
		{
			id: 1,
			label: "Dashboard",
			icon: <LayoutDashboard size={20} />,
			route: "/dashboard",
		},
		{
			id: 2,
			label: "Chamados",
			icon: <FileText size={20} />,
			route: "/chamados",
		},
		{
			id: 3,
			label: "Lista",
			icon: <List size={20} />,
			route: "/lista",
		},
		// Apenas administradores podem ver a seção de Usuários
		...(user?.role === "admin"
			? [
					{
						id: 4,
						label: "Usuários",
						icon: <Users2 size={20} />,
						route: routes.internal.users,
					},
				]
			: []),
		{
			id: 5,
			label: "Perfil",
			icon: <User size={20} />,
			route: routes.internal.profile,
		},
	];

	const queryClient = useQueryClient();
	const logoutMutation = useMutation(logout);

	const handleLogout = () => {
		logoutMutation.mutate(undefined, {
			onSuccess: () => {
				removeToken();
				queryClient.clear();
				navigate(routes.internal.login);
			},
			onError: () => {
				// Mesmo se der erro, faz logout local
				removeToken();
				queryClient.clear();
				navigate(routes.internal.login);
			},
		});
	};

	return (
		<div className="w-64 bg-[#3E5063] h-screen flex flex-col">
			{/* Logo */}
			<div className="p-6 border-b border-[#5B6A7A]">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
						<span className="text-[#3E5063] font-bold text-lg">TS</span>
					</div>
					<span className="text-white font-semibold text-lg">
						TechSupport Pro
					</span>
				</div>
			</div>

			{/* Menu Items */}
			<nav className="flex-1 p-4 space-y-2">
				{menuItems.map((item) => {
					const isActive = location.pathname === item.route;
					return (
						<Link
							key={item.id}
							to={item.route}
							className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
								isActive
									? "bg-blue-600 text-white"
									: "text-gray-300 hover:bg-[#5B6A7A] hover:text-white"
							}`}
						>
							{item.icon}
							<span className="font-medium">{item.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* Logout */}
			<div className="p-4 border-t border-[#5B6A7A]">
				<button
					onClick={handleLogout}
					className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#5B6A7A] hover:text-white w-full transition-colors"
				>
					<LogOut size={20} />
					<span className="font-medium">Sair</span>
				</button>
			</div>
		</div>
	);
}
