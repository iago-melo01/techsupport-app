/**
 * Obtém o token de acesso do localStorage
 * @returns Token de acesso ou null se não existir
 */
export function getToken(): string | null {
	return localStorage.getItem("access_token");
}
