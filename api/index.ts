import axios from 'axios';
import https from 'https';
import getConfig from 'next/config';
import NotistackService from 'services/NotistackService';
import { store } from '../store';
const { publicRuntimeConfig } = getConfig();

export const api = axios.create({
	baseURL: publicRuntimeConfig.backendUrl + '/api'
});

const httpsAgent = new https.Agent({ keepAlive: true });

api.interceptors.request.use((config) => {
	if (store.user.jwt && config.headers) {
		config.headers.Authorization = 'Bearer ' + store.user.jwt;
	}
	if (typeof window === 'undefined') {
		config.baseURL = publicRuntimeConfig.backendLocalUrl + '/api';
		config.httpsAgent = httpsAgent;
		config.timeout = 60000;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error(error?.message);
		if (error.response?.status === 401) {
			if (store.user.id) {
				store.user.logout();
			}
		}
		// if (error.response?.status === 429) {
		// 	NotistackService.ref?.enqueueSnackbar('Слишком много запросов, попробуйте позже');
		// }
		error.config.retries = error.config.retries ? error.config.retries + 1 : 1;
		if (error.config.retries > 2) {
			return Promise.reject(error);
		}
		return Promise.resolve(api(error.config));
	}
);
