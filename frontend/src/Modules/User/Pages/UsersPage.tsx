import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsersListQuery } from "@/Modules/User/Services/Queries/getUsersListQuery";
import { Trash2, UserPlus } from "lucide-react";
import { LoadingScreen } from "@/Components/Loading/LoadingScreen";
import CreateUserForm from "@/Modules/User/Components/CreateUserForm";

export default function UsersPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const { data, isLoading, isError, error } = useQuery(
		getUsersListQuery(currentPage)
	);

	if (isLoading) {
		return <LoadingScreen />;
	}

	if (isError) {
		return (
			<div className="p-6">
				<div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
					<p>Erro ao carregar usuários: {error?.message || "Erro desconhecido"}</p>
				</div>
			</div>
		);
	}

	if (!data) {
		return null;
	}

	const getRoleLabel = (role: string) => {
		const roleMap: Record<string, string> = {
			admin: "Administrador",
			user: "Usuário",
			technician: "Técnico",
			agent: "Agente",
		};
		return roleMap[role] || role;
	};

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= data.last_page) {
			setCurrentPage(page);
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-800 mb-2">Usuários</h1>
					<p className="text-gray-600">Visualize e gerencie os usuários do sistema</p>
				</div>
				<button
					onClick={() => setShowCreateForm(true)}
					className="flex items-center gap-2 px-4 py-2 bg-[#3E5063] hover:bg-[#768b9a] text-white font-medium rounded-lg transition-colors"
				>
					<UserPlus size={20} />
					Novo Usuário
				</button>
			</div>

			{showCreateForm && (
				<CreateUserForm
					onClose={() => setShowCreateForm(false)}
					onSuccess={() => {
						setShowCreateForm(false);
						setCurrentPage(1); // Volta para a primeira página para ver o novo usuário
					}}
				/>
			)}

			{/* Tabela */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						{/* Header */}
						<thead className="bg-[#3E5063]">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									ID
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									Nome
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									Email
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
									Tipo de Usuário
								</th>
								<th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
									Ações
								</th>
							</tr>
						</thead>
						{/* Body */}
						<tbody className="bg-white divide-y divide-gray-200">
							{data.data.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-4 text-center text-gray-500"
									>
										Nenhum usuário encontrado
									</td>
								</tr>
							) : (
								data.data.map((user, index) => (
									<tr
										key={user.id}
										className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{user.id}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{user.name}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{user.email}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{getRoleLabel(user.role)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<button
												className="inline-flex items-center justify-center w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
												disabled
												title="Funcionalidade de exclusão será implementada em breve"
											>
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								))
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
								<span className="font-medium">{data.total}</span> usuários
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
		</div>
	);
}
