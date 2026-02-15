import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import https from 'https';
import axiosRetry from 'axios-retry';
import { getRandomBackendLocalUrl } from 'shared/services/BackendUrlService';
import { backendUrl } from 'shared/services/EnvService';

export const api = axios.create({
	baseURL: backendUrl + '/api',
	withCredentials: true // required for browser to store Set-Cookie from API (e.g. jwt)
});

axiosRetry(api, { retries: 3 });

const httpsAgent = new https.Agent({ keepAlive: true });

export function setupApiInterceptors(
	getUserJwt: () => string,
	errorResponseUnauthorizedCallback: () => void,
	errorResponseTooManyRequestsCallback: () => void
): void {
	api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
		const userJwt = getUserJwt();
		if (userJwt && config.headers) {
			config.headers.Authorization = 'Bearer ' + userJwt;
		}
		if (typeof window === 'undefined') {
			config.baseURL = getRandomBackendLocalUrl() + '/api';
			config.httpsAgent = httpsAgent;
			config.timeout = 60000;
		}
		return config;
	});

	api.interceptors.response.use(
		(response) => response,
		(error: AxiosError) => {
			console.error(error?.message);
			if (error.response?.status === 401) {
				errorResponseUnauthorizedCallback();
			}
			if (error.response?.status === 429 && process.env.NODE_ENV === 'production') {
				errorResponseTooManyRequestsCallback();
			}
			return Promise.reject(error);
		}
	);
}
