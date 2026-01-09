import axios, {
	type InternalAxiosRequestConfig,
	type AxiosError,
} from "axios";

import {
	DataServiceAbortController,
	setAuthorizationHeader,
	TokenRefreshManager,
	getToken,
	setToken,
} from "./Token";
import { env } from "./Env/Index";
import { AuthService } from "./AuthService";

const DataService = axios.create({
	baseURL: env.API_URL,
	withCredentials: true,
	timeout: 15000,
});

// Request: injeta token se existir + cria AbortController
DataService.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = getToken();
		if (token) setAuthorizationHeader(config, token);

		// cria um AbortController para essa request
		const controller = DataServiceAbortController.create();
		config.signal = controller.signal;

		return config;
	}
);

// Response: tenta refresh quando 401
DataService.interceptors.response.use(
	(res) => res,
	async (error: AxiosError) => {
		if (!error.config) {
			return Promise.reject(error);
		}

		const originalRequest =
			error.config as InternalAxiosRequestConfig & {
				_retry?: boolean;
			};

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url?.includes("/auth/refresh")
		) {
			if (TokenRefreshManager.isRefreshing) {
				return new Promise((resolve) => {
					TokenRefreshManager.addSubscriber((token: string) => {
						setAuthorizationHeader(originalRequest, token);
						resolve(DataService(originalRequest));
					});
				});
			}

			originalRequest._retry = true;
			TokenRefreshManager.setRefreshing(true);

			try {
				// timeout curto só para refresh
				const refreshRes = await DataService.post(
					"/auth/refresh",
					{},
					{ timeout: 5000 }
				);

				const newToken = refreshRes.data.access_token;
				setToken(newToken);

				TokenRefreshManager.onRefreshed(newToken);

				setAuthorizationHeader(originalRequest, newToken);
				return DataService(originalRequest);
			} catch (err) {
				AuthService.logout();
				return Promise.reject(err);
			} finally {
				TokenRefreshManager.setRefreshing(false);
			}
		}

		return Promise.reject(error);
	}
);

export { DataService };
