import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTicket } from "@/Modules/Ticket/Services/Mutations/updateTicket";
import type { TicketListItem } from "@/Modules/Ticket/Types/Services/TicketsList";
import { X } from "lucide-react";
import { QUERY_KEYS } from "@/Constants/Service/QueryKeys";
import { useAuthContext } from "@/Context/AuthContext";

interface UpdateTicketModalProps {
	ticket: TicketListItem;
	isOpen: boolean;
	onClose: () => void;
	currentPage: number;
}

export default function UpdateTicketModal({
	ticket,
	isOpen,
	onClose,
	currentPage,
}: UpdateTicketModalProps) {
	const [status, setStatus] = useState<string>(ticket.status);
	const [isTakingResponsibility, setIsTakingResponsibility] = useState(false);
	const queryClient = useQueryClient();
	const { user } = useAuthContext();

	const mutation = useMutation(updateTicket);

	useEffect(() => {
		if (isOpen) {
			setStatus(ticket.status);
			setIsTakingResponsibility(false);
		}
	}, [isOpen, ticket]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const payload: {
			status?: "Open" | "Closed" | "Reviewing" | "Solved";
			technician_uuid?: string;
		} = {};

		// Se o status mudou, adiciona ao payload
		if (status !== ticket.status) {
			payload.status = status as "Open" | "Closed" | "Reviewing" | "Solved";
		}

		// Se o technician está se atribuindo e ainda não é responsável
		if (isTakingResponsibility && !ticket.technician_id && user) {
			payload.technician_uuid = user.uuid;
		}

		// Se não há mudanças, não faz nada
		if (Object.keys(payload).length === 0) {
			onClose();
			return;
		}

		mutation.mutate(
			{ uuid: ticket.uuid, payload },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: [...QUERY_KEYS.TICKET.LIST, currentPage],
					});
					onClose();
				},
			}
		);
	};

	if (!isOpen) return null;

	const statusOptions = [
		{ value: "Open", label: "Aberto" },
		{ value: "Reviewing", label: "Em Revisão" },
		{ value: "Solved", label: "Resolvido" },
		{ value: "Closed", label: "Fechado" },
	];

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative z-10">
				{/* Header */}
				<div className="flex justify-between items-center p-6 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-800">
						Atualizar Ticket
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X size={24} />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{/* Título do Ticket (readonly) */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Título
						</label>
						<input
							type="text"
							value={ticket.title}
							disabled
							className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
						/>
					</div>

					{/* Status */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Status *
						</label>
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E5063] focus:border-transparent"
							required
						>
							{statusOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					{/* Técnico Responsável */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Técnico Responsável
						</label>
						<input
							type="text"
							value={ticket.technician?.name || "Não atribuído"}
							disabled
							className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
						/>
					</div>

					{/* Checkbox para se tornar responsável */}
					{!ticket.technician_id && (
						<div className="flex items-center">
							<input
								type="checkbox"
								id="takeResponsibility"
								checked={isTakingResponsibility}
								onChange={(e) => setIsTakingResponsibility(e.target.checked)}
								className="w-4 h-4 text-[#3E5063] border-gray-300 rounded focus:ring-[#3E5063]"
							/>
							<label
								htmlFor="takeResponsibility"
								className="ml-2 text-sm text-gray-700"
							>
								Me tornar responsável por este ticket
							</label>
						</div>
					)}

					{/* Mensagem de erro */}
					{mutation.isError && (
						<div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
							<p className="text-sm">
								{(mutation.error?.response?.data as { message?: string })?.message ||
									"Erro ao atualizar ticket"}
							</p>
						</div>
					)}

					{/* Botões */}
					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={mutation.isPending}
							className="flex-1 px-4 py-2 bg-[#3E5063] hover:bg-[#768b9a] text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{mutation.isPending ? "Atualizando..." : "Atualizar"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
