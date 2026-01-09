import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Box, Flex, Heading } from "@radix-ui/themes";
import LabelInput from "@/Ui/Inputs/LabelInput";
import Input from "@/Ui/Inputs/Input";
import { Mail } from "lucide-react";
import ToggleVisibilityButton from "@/Ui/Buttons/ToggleVisibilityButton";
import ConfirmButton from "@/Ui/Buttons/ConfirmButton";
import Span from "@/Ui/Text/Span";
import { routes } from "@/Router/routes";
import ErrorInput from "@/Ui/Inputs/ErrorInput";
import type {
	LoginPayload,
	LoginResponse,
} from "@/Modules/Auth/Types/Services/Login";
import { QUERY_KEYS } from "@/Constants/Service/QueryKeys";
import { useNavigate } from "react-router-dom";
import { login } from "@/Modules/Auth/Services/Mutations/login";
import { LoadingOverlay } from "@/Components/Loading/LoadingOverlay";
import { setToken } from "@/Lib/Token";

type LoginForm = {
	email: string;
	password: string;
};

export default function LoginComponent() {
	const navigate = useNavigate();

	const [form, setForm] = useState<LoginForm>({
		email: "",
		password: "",
	});

	const [typeTextInput, setTypeTextInput] = useState(false);

	const mutation = useMutation<LoginResponse, AxiosError, LoginPayload>(login);

	const handleChange = (
		field: keyof LoginForm,
		value: string
	) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const queryClient = useQueryClient();

	const submit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		mutation.mutate(form, {
			onSuccess: async (data) => {
				setToken(data.access_token);

				queryClient.setQueryData(QUERY_KEYS.USER.AUTH, data.user);
				await queryClient.invalidateQueries({
					queryKey: QUERY_KEYS.USER.AUTH,
				});

				// Redireciona para dashboard (todos os usuários)
				navigate("/dashboard", { replace: true });
			},
			onError: (err) => {
				console.error("Erro ao logar", err);
			},
		});
	};

	if (mutation.isPending)
		return <LoadingOverlay message="Entrando..." />;

	return (
		<div className="flex-grow flex bg-gray-100 justify-center items-center min-h-[700px]">
			<div className="w-full max-w-[500px] p-4">
				<form
					onSubmit={submit}
					className="
						w-full 
						p-8 
						bg-white 
						rounded-md 
						shadow-md 
						min-h-[450px]       
						justify-between
						sm:min-h-[500px]
						flex flex-col 
					"
				>
					<Heading
						as="h2"
						align="center"
						weight="bold"
						className="text-gray-600"
						mt="4"
					>
						TechSupport Pro
					</Heading>

					<Box className="mt-5">
						<LabelInput htmlFor="email" value="Email" />
						<Flex align="center">
							<Input
								id="email"
								type="email"
								name="email"
								value={form.email}
								className="w-full p-[10px] border border-[#ccc] rounded-[5px] text-[14px] mt-2 shadow-[0_4px_8px_rgba(0,0,0,0.4)] focus:outline-none focus:border-[#3e5063] mr-[-2rem]"
								autoComplete="username"
								isFocused={true}
								placeholder="Informe seu email..."
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									handleChange("email", e.target.value)
								}
							/>
							<Mail className="w-5 h-7 text-[#2E3E4D] pt-[8px]" />
						</Flex>
						{mutation.error && (
							<ErrorInput
								message="Email ou senha incorretos"
								className="mt-2"
							/>
						)}
					</Box>

					<Box className="mt-5">
						<LabelInput htmlFor="password" value="Senha" />
						<Flex align="center">
							<Input
								id="password"
								type={typeTextInput ? "text" : "password"}
								name="password"
								value={form.password}
								className="w-full p-[10px] border border-[#ccc] rounded-[5px] text-[14px] mt-2 shadow-[0_4px_8px_rgba(0,0,0,0.4)] focus:outline-none focus:border-[#3e5063] mr-[-2rem]"
								autoComplete="current-password"
								placeholder="Informe sua senha..."
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									handleChange("password", e.target.value)
								}
							/>
							<ToggleVisibilityButton
								isVisible={typeTextInput}
								onToggle={() => setTypeTextInput(!typeTextInput)}
							/>
						</Flex>
						{mutation.error && (
							<ErrorInput message="Senha inválida" className="mt-2" />
						)}
					</Box>

					<div className="flex justify-end items-center mt-4">
						<ConfirmButton
							type="submit"
							disabled={mutation.isPending}
						>
							{mutation.isPending ? "Entrando..." : "Entrar"}
						</ConfirmButton>
					</div>
				</form>
			</div>
		</div>
	);
}
