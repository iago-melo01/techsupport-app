import { getToken, tryRefreshToken } from "@/Lib/Token";
import { Navigate, useLocation } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/Components/Loading/LoadingScreen";

export default function RequireAuth({ children }: PropsWithChildren) {
	const location = useLocation();
	const [isChecking, setIsChecking] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			const token = getToken();

			// Se já tem access token, está autenticado
			if (token) {
				setIsAuthenticated(true);
				setIsChecking(false);
				return;
			}

			// Se não tem access token, tenta fazer refresh
			const refreshed = await tryRefreshToken();

			if (refreshed) {
				// Refresh funcionou, usuário está autenticado
				setIsAuthenticated(true);
			} else {
				// Não há refresh token ou refresh falhou
				setIsAuthenticated(false);
			}

			setIsChecking(false);
		};

		checkAuth();
	}, []);

	// Mostra loading enquanto verifica autenticação
	if (isChecking) {
		return <LoadingScreen message="Verificando autenticação..." />;
	}

	// Se não está autenticado, redireciona para login
	if (!isAuthenticated) {
		return (
			<Navigate to="/login" replace state={{ from: location }} />
		);
	}

	return <>{children}</>;
}
