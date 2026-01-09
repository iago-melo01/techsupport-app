import { DataServiceAbortController, removeToken } from "./Token";
import { routes } from "@/Router/routes";

/**
 * Serviço global de autenticação.
 * Usado principalmente em interceptors do axios quando logout é necessário
 * fora do contexto React (ex: quando o refresh token falha).
 */
export const AuthService = {
	logout() {
		DataServiceAbortController.abortAll();
		removeToken();
		window.location.replace(routes.internal.login);
	},
};
