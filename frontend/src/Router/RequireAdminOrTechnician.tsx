import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAuthContext } from "@/Context/AuthContext";
import { LoadingScreen } from "@/Components/Loading/LoadingScreen";
import { routes } from "./routes";

export default function RequireAdminOrTechnician({ children }: PropsWithChildren) {
	const { user, isPending } = useAuthContext();

	// Mostra loading enquanto carrega dados do usuário
	if (isPending) {
		return <LoadingScreen message="Verificando permissões..." />;
	}

	// Se não há usuário ou não é admin nem technician, redireciona para dashboard
	if (!user || (user.role !== "admin" && user.role !== "technician")) {
		return <Navigate to={routes.internal.dashboard} replace />;
	}

	return <>{children}</>;
}
