import { useAuthContext } from "@/Context/AuthContext";
import StatsCard from "../Components/StatsCard";
import TicketsByStatusChart from "../Components/TicketsByStatusChart";
import CategoryRanking from "../Components/CategoryRanking";
import { Ticket, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function DashboardPage() {
	const { user } = useAuthContext();

	// Dados mockados - serão substituídos por dados reais da API
	const stats = {
		totalTickets: 154,
		inProgress: 32,
		resolved: 88,
		pending: 34,
	};

	const ticketsByStatus = [
		{ status: "aberto", count: stats.pending, color: "bg-yellow-500" },
		{ status: "em_progresso", count: stats.inProgress, color: "bg-blue-500" },
		{ status: "resolvido", count: stats.resolved, color: "bg-green-500" },
		{ status: "fechado", count: 0, color: "bg-gray-500" },
	];

	const categoryRanking = [
		{ name: "Hardware", count: 45 },
		{ name: "Software", count: 38 },
		{ name: "Rede", count: 32 },
		{ name: "Outros", count: 39 },
	];

	return (
		<div className="p-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Dashboard
				</h1>
				<p className="text-gray-600">
					Bem-vindo, {user?.name}! Aqui está um resumo dos chamados.
				</p>
			</div>

			{/* Cards de KPIs */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatsCard
					title="Total de Tickets"
					value={stats.totalTickets}
					subtitle="Todos os chamados"
					trend={{ label: "Este mês", value: "+12%", isPositive: true }}
					icon={<Ticket className="w-6 h-6" />}
				/>
				<StatsCard
					title="Em Progresso"
					value={stats.inProgress}
					subtitle="Sendo atendidos"
					trend={{ label: "Hoje", value: "+5", isPositive: true }}
					icon={<Clock className="w-6 h-6" />}
				/>
				<StatsCard
					title="Resolvidos"
					value={stats.resolved}
					subtitle="Problemas solucionados"
					trend={{ label: "Esta semana", value: "+18%", isPositive: true }}
					icon={<CheckCircle className="w-6 h-6" />}
				/>
				<StatsCard
					title="Pendentes"
					value={stats.pending}
					subtitle="Aguardando atendimento"
					trend={{ label: "Hoje", value: "-3", isPositive: false }}
					icon={<AlertCircle className="w-6 h-6" />}
				/>
			</div>

			{/* Gráficos e Rankings */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<TicketsByStatusChart data={ticketsByStatus} />
				<CategoryRanking categories={categoryRanking} />
			</div>
		</div>
	);
}
