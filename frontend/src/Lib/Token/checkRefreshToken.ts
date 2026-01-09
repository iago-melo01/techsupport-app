import axios from "axios";
import { env } from "../Env/Index";
import { setToken } from "./setToken";

/**
 * Tenta fazer refresh do token usando o refresh token do cookie
 * Usa uma instância separada de axios para evitar dependências circulares
 * @returns Promise<boolean> - true se o refresh foi bem-sucedido, false caso contrário
 */
export async function tryRefreshToken(): Promise<boolean> {
	try {
		// Usa instância separada para evitar problemas de interceptor
		const response = await axios.post(
			`${env.API_URL}/auth/refresh`,
			{},
			{
				withCredentials: true, // Importante para enviar o cookie do refresh token
				timeout: 5000,
			}
		);
		
		if (response.data?.access_token) {
			setToken(response.data.access_token);
			return true;
		}
		
		return false;
	} catch (error) {
		// Refresh falhou - não há refresh token válido ou expirou
		return false;
	}
}
