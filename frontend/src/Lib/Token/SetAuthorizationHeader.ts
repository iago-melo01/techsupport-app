import type { InternalAxiosRequestConfig } from "axios";

export function setAuthorizationHeader(
	request: InternalAxiosRequestConfig,
	token: string
) {
	(request.headers ??= {}).Authorization = `Bearer ${token}`;
}
