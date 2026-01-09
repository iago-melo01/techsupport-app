/**
 * Define o token de acesso no localStorage
 * @param token - Token de acesso
 */
export function setToken(token: string): void {
	localStorage.setItem("access_token", token);

	// Dispara evento customizado para notificar mudança de token
	window.dispatchEvent(new Event("token-changed"));
}
