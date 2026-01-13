import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken, tryRefreshToken, isTokenValid } from "@/Lib/Token";
import { LoadingScreen } from "@/Components/Loading/LoadingScreen";
import { routes } from "./routes";

/**
 * Componente que redireciona usuários autenticados para o dashboard
 * Usado para proteger rotas de guest (como /login)
 * 
 * Comportamento:
 * - Se possui access token válido: redireciona para dashboard
 * - Se possui access token expirado: tenta fazer refresh e redireciona para dashboard
 * - Se não possui autenticação: permite acesso à rota de guest
 */
export default function RedirectIfAuthenticated({
	children,
}: { children: React.ReactNode }) {
	const [isChecking, setIsChecking] = useState(true);
	const [shouldRedirect, setShouldRedirect] = useState(false);

	useEffect(() => {
		const checkAuthAndRedirect = async () => {
			const token = getToken();

			// Se já tem access token válido e não expirado, redireciona para dashboard
			if (token && isTokenValid(token)) {
				setShouldRedirect(true);
				setIsChecking(false);
				return;
			}

			// Se não tem access token válido, tenta fazer refresh
			const refreshed = await tryRefreshToken();

			if (refreshed) {
				// Refresh funcionou, redireciona para dashboard
				setShouldRedirect(true);
			} else {
				// Não há refresh token válido, permite acesso à rota de guest
				setShouldRedirect(false);
			}

			setIsChecking(false);
		};

		checkAuthAndRedirect();
	}, []);

	// Mostra loading enquanto verifica autenticação
	if (isChecking) {
		return <LoadingScreen message="Verificando autenticação..." />;
	}

	// Se está autenticado (token válido ou refresh funcionou), redireciona para dashboard
	if (shouldRedirect) {
		return <Navigate to={routes.internal.dashboard} replace />;
	}

	// Se não está autenticado, permite acesso à rota de guest
	return <>{children}</>;
}
