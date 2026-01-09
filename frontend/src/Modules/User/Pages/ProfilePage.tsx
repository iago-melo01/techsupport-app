import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useAuthContext } from "@/Context/AuthContext";
import Input from "@/Ui/Inputs/Input";
import LabelInput from "@/Ui/Inputs/LabelInput";
import ConfirmButton from "@/Ui/Buttons/ConfirmButton";
import ToggleVisibilityButton from "@/Ui/Buttons/ToggleVisibilityButton";
import ErrorInput from "@/Ui/Inputs/ErrorInput";
import { MapPin, User as UserIcon, Pencil } from "lucide-react";
import { Flex } from "@radix-ui/themes";

export default function ProfilePage() {
	const { user } = useAuthContext();
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [profileForm, setProfileForm] = useState({
		name: "",
		email: "",
		phone: "",
	});

	// Atualiza o formulário quando o usuário carregar
	useEffect(() => {
		if (user) {
			setProfileForm({
				name: user.name || "",
				email: user.email || "",
				phone: "",
			});
		}
	}, [user]);

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [errors, setErrors] = useState<{
		name?: string;
		email?: string;
		phone?: string;
		currentPassword?: string;
		newPassword?: string;
		confirmPassword?: string;
	}>({});

	if (!user) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-gray-600">Carregando informações do usuário...</p>
			</div>
		);
	}

	const handleProfileChange = (field: string, value: string) => {
		setProfileForm((prev) => ({ ...prev, [field]: value }));
		if (errors[field as keyof typeof errors]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handlePasswordChange = (field: string, value: string) => {
		setPasswordForm((prev) => ({ ...prev, [field]: value }));
		if (errors[field as keyof typeof errors]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleProfileSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// TODO: Implementar atualização de perfil
		console.log("Atualizar perfil:", profileForm);
	};

	const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validações
		const newErrors: typeof errors = {};

		if (!passwordForm.currentPassword) {
			newErrors.currentPassword = "Senha atual é obrigatória";
		}

		if (!passwordForm.newPassword) {
			newErrors.newPassword = "Nova senha é obrigatória";
		} else if (passwordForm.newPassword.length < 8) {
			newErrors.newPassword = "A senha deve ter pelo menos 8 caracteres";
		}

		if (!passwordForm.confirmPassword) {
			newErrors.confirmPassword = "Confirmação de senha é obrigatória";
		} else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			newErrors.confirmPassword = "As senhas não coincidem";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		// TODO: Implementar atualização de senha
		console.log("Atualizar senha");
	};

	const getRoleLabel = (role: string) => {
		switch (role) {
			case "user":
				return "Colaborador";
			case "agent":
				return "Técnico de Suporte";
			case "admin":
				return "Administrador";
			default:
				return role;
		}
	};

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - Profile Card */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						{/* Profile Picture */}
						<div className="flex justify-center mb-4">
							<div className="relative">
								<div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
									<UserIcon size={64} className="text-gray-400" />
								</div>
								<button
									type="button"
									className="absolute bottom-0 right-0 w-8 h-8 bg-[#3E5063] rounded-full flex items-center justify-center text-white hover:bg-[#768b9a] transition-colors"
									aria-label="Editar foto"
								>
									<Pencil size={16} />
								</button>
							</div>
						</div>

						{/* User Name */}
						<h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
							{user.name}
						</h2>

						{/* Address (placeholder) */}
						<div className="flex items-center gap-2 text-gray-600 mb-2 justify-center">
							<MapPin size={18} />
							<span className="text-sm">Endereço não informado</span>
						</div>

						{/* Role Badge */}
						<div className="flex items-center justify-center gap-2 mb-4">
							<span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
								{getRoleLabel(user.role)}
							</span>
						</div>

						{/* Close Account Button */}
						<button
							type="button"
							className="w-full mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
						>
							Fechar Conta
						</button>
					</div>
				</div>

				{/* Right Column - Forms */}
				<div className="lg:col-span-2 space-y-6">
					{/* Profile Information Form */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-6">
							User Information
						</h3>

						<form onSubmit={handleProfileSubmit} className="space-y-4">
							<div>
								<LabelInput htmlFor="name" value="Name" />
								<Input
									id="name"
									type="text"
									value={profileForm.name}
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										handleProfileChange("name", e.target.value)
									}
									className="mt-1"
								/>
								{errors.name && (
									<ErrorInput message={errors.name} className="mt-1" />
								)}
							</div>

							<div>
								<LabelInput htmlFor="email" value="Email" />
								<Input
									id="email"
									type="email"
									value={profileForm.email}
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										handleProfileChange("email", e.target.value)
									}
									className="mt-1"
								/>
								{errors.email && (
									<ErrorInput message={errors.email} className="mt-1" />
								)}
							</div>

							<div>
								<LabelInput htmlFor="phone" value="Phone" />
								<Input
									id="phone"
									type="tel"
									value={profileForm.phone}
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										handleProfileChange("phone", e.target.value)
									}
									placeholder="Telefone"
									className="mt-1"
								/>
								{errors.phone && (
									<ErrorInput message={errors.phone} className="mt-1" />
								)}
							</div>

							<div className="pt-4">
								<ConfirmButton type="submit">Save Now</ConfirmButton>
							</div>
						</form>
					</div>

					{/* Password Form */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-6">
							Password
						</h3>

						<form onSubmit={handlePasswordSubmit} className="space-y-4">
							<div>
								<LabelInput htmlFor="currentPassword" value="Current Password" />
								<Flex align="center" className="mt-1">
									<Input
										id="currentPassword"
										type={showCurrentPassword ? "text" : "password"}
										value={passwordForm.currentPassword}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											handlePasswordChange(
												"currentPassword",
												e.target.value
											)
										}
										placeholder="************"
										className="mr-[-2rem]"
									/>
									<ToggleVisibilityButton
										isVisible={showCurrentPassword}
										onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
									/>
								</Flex>
								{errors.currentPassword && (
									<ErrorInput
										message={errors.currentPassword}
										className="mt-1"
									/>
								)}
							</div>

							<div>
								<LabelInput htmlFor="newPassword" value="New Password" />
								<Flex align="center" className="mt-1">
									<Input
										id="newPassword"
										type={showNewPassword ? "text" : "password"}
										value={passwordForm.newPassword}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											handlePasswordChange("newPassword", e.target.value)
										}
										placeholder="New Password"
										className="mr-[-2rem]"
									/>
									<ToggleVisibilityButton
										isVisible={showNewPassword}
										onToggle={() => setShowNewPassword(!showNewPassword)}
									/>
								</Flex>
								{errors.newPassword && (
									<ErrorInput message={errors.newPassword} className="mt-1" />
								)}
							</div>

							<div>
								<LabelInput
									htmlFor="confirmPassword"
									value="Confirm New Password"
								/>
								<Flex align="center" className="mt-1">
									<Input
										id="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										value={passwordForm.confirmPassword}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											handlePasswordChange("confirmPassword", e.target.value)
										}
										placeholder="Confirm New Password"
										className="mr-[-2rem]"
									/>
									<ToggleVisibilityButton
										isVisible={showConfirmPassword}
										onToggle={() =>
											setShowConfirmPassword(!showConfirmPassword)
										}
									/>
								</Flex>
								{errors.confirmPassword && (
									<ErrorInput
										message={errors.confirmPassword}
										className="mt-1"
									/>
								)}
							</div>

							<div className="pt-4">
								<ConfirmButton type="submit">Save Password</ConfirmButton>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
