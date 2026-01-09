/**
 * Remove o token de acesso do localStorage
 */
export function removeToken(): void {
	localStorage.removeItem("access_token");
	window.dispatchEvent(new Event("token-changed"));
}
