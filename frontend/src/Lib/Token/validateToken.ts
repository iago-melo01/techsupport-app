/**
 * Valida se um token JWT está expirado baseado no payload
 * @param token - Token JWT
 * @returns boolean - true se o token não está expirado, false caso contrário
 */
export function isTokenValid(token: string): boolean {
	try {
		// Decodifica o payload do JWT (sem verificar assinatura)
		// JWT tem formato: header.payload.signature
		const parts = token.split(".");
		
		if (parts.length !== 3) {
			return false;
		}
		
		// Decodifica o payload (base64url)
		const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
		
		// Verifica se tem campo 'exp' (expiration time)
		if (!payload.exp) {
			return false;
		}
		
		// Verifica se o token não expirou (exp está em segundos Unix timestamp)
		const currentTime = Math.floor(Date.now() / 1000);
		return payload.exp > currentTime;
	} catch (error) {
		// Se houver erro ao decodificar, considera inválido
		return false;
	}
}
