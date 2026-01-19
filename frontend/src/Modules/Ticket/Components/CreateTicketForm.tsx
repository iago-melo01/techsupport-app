import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Box, Flex } from "@radix-ui/themes";
import LabelInput from "@/Ui/Inputs/LabelInput";
import Input from "@/Ui/Inputs/Input";
import ErrorInput from "@/Ui/Inputs/ErrorInput";
import ConfirmButton from "@/Ui/Buttons/ConfirmButton";
import { LoadingOverlay } from "@/Components/Loading/LoadingOverlay";
import { X } from "lucide-react";
import type { CreateTicketPayload } from "@/Modules/Ticket/Types/Services/CreateTicket";
import { getCategoriesQuery } from "@/Modules/Ticket/Services/Queries/getCategoriesQuery";
import { storeTicket } from "@/Modules/Ticket/Services/Mutations/storeTicket";

type CreateTicketFormProps = {
	onClose: () => void;
	onSuccess?: () => void;
};

type FormData = {
	title: string;
	description: string;
	category_uuid: string;
};

export default function CreateTicketForm({
	onClose,
	onSuccess,
}: CreateTicketFormProps) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<FormData>({
		title: "",
		description: "",
		category_uuid: "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const { data: categories, isLoading: isLoadingCategories } = useQuery(
		getCategoriesQuery
	);

	const mutation = useMutation<
		unknown,
		AxiosError<{ message?: string; errors?: Record<string, string[]> }>,
		CreateTicketPayload
	>(storeTicket);

	const handleChange = (field: keyof FormData, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		// Limpa erro do campo quando o usuário começa a digitar
		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const submit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});

		const payload: CreateTicketPayload = {
			title: form.title.trim(),
			description: form.description.trim(),
			category_uuid: form.category_uuid,
		};

		mutation.mutate(payload, {
			onSuccess: () => {
				// Invalida queries relacionadas se necessário
				queryClient.invalidateQueries({
					queryKey: ["tickets"],
				});

				if (onSuccess) {
					onSuccess();
				} else {
					onClose();
				}
			},
			onError: (error) => {
				if (error.response?.data?.errors) {
					// Converte erros do Laravel para o formato esperado
					const formattedErrors: Record<string, string> = {};
					Object.keys(error.response.data.errors).forEach((key) => {
						const errorMessages = error.response?.data?.errors?.[key];
						if (errorMessages && errorMessages.length > 0) {
							formattedErrors[key] = errorMessages[0];
						}
					});
					setErrors(formattedErrors);
				} else if (error.response?.data?.message) {
					setErrors({ general: error.response.data.message });
				}
			},
		});
	};

	if (mutation.isPending) {
		return <LoadingOverlay message="Criando ticket..." />;
	}

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
					<h2 className="text-2xl font-bold text-gray-800">
						Criar Ticket
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 transition-colors"
						type="button"
					>
						<X size={24} />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={submit} className="p-6 space-y-5">
					{/* Erro geral */}
					{errors.general && (
						<div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
							{errors.general}
						</div>
					)}

					{/* Título do Ticket */}
					<Box>
						<LabelInput htmlFor="title" value="Título do Ticket *" />
						<Input
							id="title"
							type="text"
							name="title"
							value={form.title}
							className="w-full p-[10px] border border-[#ccc] rounded-[5px] text-[14px] mt-2 shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#3e5063]"
							placeholder="Ex: Problema com impressora"
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								handleChange("title", e.target.value)
							}
						/>
						{errors.title && (
							<ErrorInput message={errors.title} className="mt-2" />
						)}
					</Box>

					{/* Categoria */}
					<Box>
						<LabelInput htmlFor="category" value="Categoria *" />
						<select
							id="category"
							name="category"
							value={form.category_uuid}
							onChange={(e: ChangeEvent<HTMLSelectElement>) =>
								handleChange("category_uuid", e.target.value)
							}
							className="w-full p-[10px] border border-[#ccc] rounded-[5px] text-[14px] mt-2 shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#3e5063]"
							disabled={isLoadingCategories}
						>
						<option value="">
							{isLoadingCategories
								? "Carregando categorias..."
								: "Selecione a Categoria"}
						</option>
						{Array.isArray(categories) &&
							categories.map((category) => (
								<option key={category.uuid} value={category.uuid}>
									{category.name}
								</option>
							))}
						</select>
						{errors.category_uuid && (
							<ErrorInput message={errors.category_uuid} className="mt-2" />
						)}
					</Box>

					{/* Descrição */}
					<Box>
						<LabelInput htmlFor="description" value="Descrição *" />
						<textarea
							id="description"
							name="description"
							value={form.description}
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
								handleChange("description", e.target.value)
							}
							rows={6}
							className="w-full p-[10px] border border-[#ccc] rounded-[5px] text-[14px] mt-2 shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#3e5063] resize-y"
							placeholder="Descreva o problema ou solicitação..."
						/>
						{errors.description && (
							<ErrorInput message={errors.description} className="mt-2" />
						)}
					</Box>

					{/* Botões */}
					<Flex gap="3" justify="end" className="mt-6 pt-4 border-t border-gray-200">
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
						>
							Cancelar
						</button>
						<ConfirmButton type="submit" disabled={mutation.isPending}>
							{mutation.isPending ? "Criando..." : "Criar Ticket"}
						</ConfirmButton>
					</Flex>
				</form>
			</div>
		</div>
	);
}
