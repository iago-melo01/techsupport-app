import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken, tryRefreshToken, isTokenValid } from "@/Lib/Token";
import { LoadingScreen } from "@/Components/Loading/LoadingScreen";

/**
 * Componente que verifica autenticação na rota raiz ("/")
 * e redireciona para /dashboard se autenticado ou /login se não autenticado
 */
export default function RootRedirect() {
	const [isChecking, setIsChecking] = useState(true);
	const [shouldRedirectToDashboard, setShouldRedirectToDashboard] = useState(false);

	useEffect(() => {
		const checkAuthAndRedirect = async () => {
			const token = getToken();

			// Se já tem access token válido e não expirado, redireciona para dashboard
			if (token && isTokenValid(token)) {
				setShouldRedirectToDashboard(true);
				setIsChecking(false);
				return;
			}

			// Se não tem access token válido, tenta fazer refresh
			const refreshed = await tryRefreshToken();

			if (refreshed) {
				// Refresh funcionou, redireciona para dashboard
				setShouldRedirectToDashboard(true);
			} else {
				// Não há refresh token válido, redireciona para login
				setShouldRedirectToDashboard(false);
			}

			setIsChecking(false);
		};

		checkAuthAndRedirect();
	}, []);

	// Mostra loading enquanto verifica autenticação
	if (isChecking) {
		return <LoadingScreen message="Verificando autenticação..." />;
	}

	// Redireciona baseado no resultado da verificação
	if (shouldRedirectToDashboard) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Navigate to="/login" replace />;
}
