import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTicketsListQuery } from "@/Modules/Ticket/Services/Queries/getTicketsListQuery";
import { LoadingScreen } from "@/Components/Loading/LoadingScreen";
import { FileText, Edit } from "lucide-react";
import { useAuthContext } from "@/Context/AuthContext";
import UpdateTicketModal from "@/Modules/Ticket/Components/UpdateTicketModal";
import type { TicketListItem } from "@/Modules/Ticket/Types/Services/TicketsList";

export default function TicketsPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedTicket, setSelectedTicket] = useState<TicketListItem | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { user } = useAuthContext();
	const { data, isLoading, isError, error } = useQuery(
		getTicketsListQuery(currentPage)
	);

	if (isLoading) {
		return <LoadingScreen />;
	}

	if (isError) {
		return (
			<div className="p-6">
				<div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
					<p>Erro ao carregar tickets: {error?.message || "Erro desconhecido"}</p>
				</div>
			</div>
		);
	}

	if (!data) {
		return null;
	}

	const getStatusLabel = (status: string) => {
		const statusMap: Record<string, { label: string; color: string }> = {
			Open: { label: "Aberto", color: "bg-blue-100 text-blue-800" },
			Reviewing: { label: "Em Revisão", color: "bg-yellow-100 text-yellow-800" },
			Solved: { label: "Resolvido", color: "bg-green-100 text-green-800" },
			Closed: { label: "Fechado", color: "bg-gray-100 text-gray-800" },
			// Compatibilidade com formato antigo (se houver)
			open: { label: "Aberto", color: "bg-blue-100 text-blue-800" },
			in_progress: { label: "Em Progresso", color: "bg-yellow-100 text-yellow-800" },
			resolved: { label: "Resolvido", color: "bg-green-100 text-green-800" },
			closed: { label: "Fechado", color: "bg-gray-100 text-gray-800" },
		};
		return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" };
	};

	const handleEditTicket = (ticket: TicketListItem) => {
		setSelectedTicket(ticket);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedTicket(null);
	};

	// Apenas technicians podem editar tickets
	const canEditTicket = user?.role === "technician";

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= data.last_page) {
			setCurrentPage(page);
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-800 mb-2">Tickets</h1>
					<p className="text-gray-600">Visualize e gerencie todos os tickets do sistema</p>
				</div>
				<div className="flex items-center gap-2 text-gray-600">
					<FileText size={24} />
					<span className="text-sm font-medium">
						Total: {data.total}
					</span>
				</div>
			</div>

			{/* Tabela */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						{/* Header */}
						<thead className="bg-[#3E5063]">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									Título
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									Categoria
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									Solicitante
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									Técnico
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									Descrição
								</th>
								{canEditTicket && (
									<th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
										Ações
									</th>
								)}
							</tr>
						</thead>
						{/* Body */}
						<tbody className="bg-white divide-y divide-gray-200">
							{data.data.length === 0 ? (
								<tr>
									<td
										colSpan={canEditTicket ? 7 : 6}
										className="px-6 py-4 text-center text-gray-500"
									>
										Nenhum ticket encontrado
									</td>
								</tr>
							) : (
								data.data.map((ticket, index) => {
									const statusInfo = getStatusLabel(ticket.status);
									return (
										<tr
											key={ticket.uuid}
											className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
										>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												{ticket.title}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{ticket.category.name}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{ticket.user.name}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{ticket.technician?.name || (
													<span className="text-gray-400 italic">Não atribuído</span>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
												>
													{statusInfo.label}
												</span>
											</td>
											<td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
												{ticket.description}
											</td>
											{canEditTicket && (
												<td className="px-6 py-4 whitespace-nowrap text-center">
													<button
														onClick={() => handleEditTicket(ticket)}
														className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors"
														title="Editar ticket"
													>
														<Edit size={16} />
													</button>
												</td>
											)}
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>

				{/* Paginação */}
				{data.last_page > 1 && (
					<div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
						<div className="flex items-center justify-between flex-wrap gap-4">
							<div className="text-sm text-gray-700">
								Mostrando <span className="font-medium">{data.from || 0}</span> até{" "}
								<span className="font-medium">{data.to || 0}</span> de{" "}
								<span className="font-medium">{data.total}</span> tickets
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={!data.prev_page_url || currentPage === 1}
									className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									Anterior
								</button>
								<div className="flex items-center gap-1">
									{Array.from({ length: data.last_page }, (_, i) => i + 1)
										.filter((page) => {
											// Mostra primeira, última, atual e 2 páginas antes/depois
											if (page === 1 || page === data.last_page) return true;
											if (Math.abs(page - currentPage) <= 2) return true;
											return false;
										})
										.map((page, index, array) => {
											// Adiciona "..." quando há gap
											const prevPage = array[index - 1];
											const showEllipsis = prevPage && page - prevPage > 1;

											return (
												<div key={page} className="flex items-center gap-1">
													{showEllipsis && (
														<span className="px-2 text-gray-500">...</span>
													)}
													<button
														onClick={() => handlePageChange(page)}
														className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
															page === currentPage
																? "bg-blue-600 text-white"
																: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
														}`}
													>
														{page}
													</button>
												</div>
											);
										})}
								</div>
								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={!data.next_page_url || currentPage === data.last_page}
									className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									Próximo
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Modal de Atualização */}
			{selectedTicket && (
				<UpdateTicketModal
					ticket={selectedTicket}
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					currentPage={currentPage}
				/>
			)}
		</div>
	);
}
