import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Box, Flex } from "@radix-ui/themes";
import LabelInput from "@/Ui/Inputs/LabelInput";
import Input from "@/Ui/Inputs/Input";
import ToggleVisibilityButton from "@/Ui/Buttons/ToggleVisibilityButton";
import ConfirmButton from "@/Ui/Buttons/ConfirmButton";
import ErrorInput from "@/Ui/Inputs/ErrorInput";
import type { CreateUserPayload } from "@/Modules/User/Types/Services/CreateUser";
import { QUERY_KEYS } from "@/Constants/Service/QueryKeys";
import { storeUser } from "@/Modules/User/Services/Mutations/storeUser";
import { LoadingOverlay } from "@/Components/Loading/LoadingOverlay";
import { X } from "lucide-react";

type CreateUserFormProps = {
	onClose: () => void;
	onSuccess?: () => void;
};

type FormData = {
	name: string;
	email: string;
	password: string;
	role: "admin" | "technician" | "user";
	phone: string;
	status: "active" | "inactive";
};

export default function CreateUserForm({
	onClose,
	onSuccess,
}: CreateUserFormProps) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<FormData>({
		name: "",
		email: "",
		password: "",
		role: "user",
		phone: "",
		status: "active",
	});

	const [typeTextInput, setTypeTextInput] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const mutation = useMutation<
		unknown,
		AxiosError<{ message?: string; errors?: Record<string, string[]> }>,
		CreateUserPayload
	>(storeUser);

	const handleChange = (
		field: keyof FormData,
		value: string
	) => {
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

		const payload: CreateUserPayload = {
			name: form.name.trim(),
			email: form.email.trim(),
			password: form.password,
			role: form.role,
			phone: form.phone.trim() || null,
			status: form.status,
		};

		mutation.mutate(payload, {
			onSuccess: () => {
				// Invalida a query de lista de usuários para atualizar
				queryClient.invalidateQueries({
					queryKey: QUERY_KEYS.USER.LIST,
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
				}
			},
		});
	};

	if (mutation.isPending) {
		return <LoadingOverlay message="Criando usuário..." />;
	}

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
					<h2 className="text-2xl font-bold text-gray-800">
						Cadastrar Novo Usuário
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
					{/* Nome */}
					<Box>
						<LabelInput htmlFor="name" value="Nome *" />
						<Input
							id="name"
							type="text"
							name="name"
							value={form.name}
							className="w-full p-[10px] border border-[#ccc] rounded-[5px] text-[14px] mt-2 shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#3e5063]"
							placeholder="Informe o nome completo..."
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								handleChange("name", e.target.value)
							}
						/>
						{errors.name && (
							<ErrorInput message={errors.name} className="mt-2" />
						)}
					</Box>

					{/* Email */}
					<Box>
						<LabelInput htmlFor="email" value="Email *" />
						<Input
							id="email"
							type="email"
							name="email"
							value={form.email}
							className="w-full p-[10px] border border-[#ccc] rounded-[5px] text-[14px] mt-2 shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#3e5063]"
							placeholder="Informe o email..."
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								handleChange("email", e.target.value)
							}
						/>
						{errors.email && (
							<ErrorInput message={errors.email} className="mt-2" />
						)}
					</Box>

					{/* Senha */}
					<Box>
						<LabelInput htmlFor="password" value="Senha *" />
						<Flex align="center">
							<Input
								id="password"
								type={typeTextInput ? "text" : "password"}
								name="password"
								value={form.password}
								className="w-full p-[10px] border border-[#ccc] rounded-[5px] text-[14px] mt-2 shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#3e5063] mr-[-2rem]"
								placeholder="Informe a senha (mínimo 8 caracteres)..."
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									handleChange("password", e.target.value)
								}
							/>
							<ToggleVisibilityButton
								isVisible={typeTextInput}
								onToggle={() => setTypeTextInput(!typeTextInput)}
							/>
						</Flex>
						{errors.password && (
							<ErrorInput message={errors.password} className="mt-2" />
						)}
					</Box>

					{/* Telefone */}
					<Box>
						<LabelInput htmlFor="phone" value="Telefone" />
						<Input
							id="phone"
							type="text"
							name="phone"
							value={form.phone}
							className="w-full p-[10px] border border-[#ccc] rounded-[5px] text-[14px] mt-2 shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#3e5063]"
							placeholder="Informe o telefone (opcional)..."
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								handleChange("phone", e.target.value)
							}
						/>
						{errors.phone && (
							<ErrorInput message={errors.phone} className="mt-2" />
						)}
					</Box>

					{/* Role e Status em linha */}
					<Flex gap="4" className="flex-col sm:flex-row">
						{/* Role */}
						<Box className="flex-1">
							<LabelInput htmlFor="role" value="Tipo de Usuário *" />
							<select
								id="role"
								name="role"
								value={form.role}
								onChange={(e: ChangeEvent<HTMLSelectElement>) =>
									handleChange("role", e.target.value as FormData["role"])
								}
								className="w-full p-[10px] border border-[#ccc] rounded-[5px] text-[14px] mt-2 shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#3e5063]"
							>
								<option value="user">Usuário</option>
								<option value="technician">Técnico</option>
								<option value="admin">Administrador</option>
							</select>
							{errors.role && (
								<ErrorInput message={errors.role} className="mt-2" />
							)}
						</Box>

						{/* Status */}
						<Box className="flex-1">
							<LabelInput htmlFor="status" value="Status *" />
							<select
								id="status"
								name="status"
								value={form.status}
								onChange={(e: ChangeEvent<HTMLSelectElement>) =>
									handleChange(
										"status",
										e.target.value as FormData["status"]
									)
								}
								className="w-full p-[10px] border border-[#ccc] rounded-[5px] text-[14px] mt-2 shadow-[0_4px_8px_rgba(0,0,0,0.1)] focus:outline-none focus:border-[#3e5063]"
							>
								<option value="active">Ativo</option>
								<option value="inactive">Inativo</option>
							</select>
							{errors.status && (
								<ErrorInput message={errors.status} className="mt-2" />
							)}
						</Box>
					</Flex>

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
							{mutation.isPending ? "Criando..." : "Criar Usuário"}
						</ConfirmButton>
					</Flex>
				</form>
			</div>
		</div>
	);
}
