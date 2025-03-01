import axios from 'axios';
import https from 'https';
import axiosRetry from 'axios-retry';
import getConfig from 'next/config';
import NotistackService from 'services/NotistackService';
import { store } from '../store';
const { publicRuntimeConfig } = getConfig();

export const api = axios.create({
	baseURL: publicRuntimeConfig.backendUrl + '/api'
});

axiosRetry(api, { retries: 3 });

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
		if (error.response?.status === 429 && process.env.NODE_ENV === 'production') {
			NotistackService.ref?.enqueueSnackbar('Слишком много запросов, попробуйте позже', { variant: 'warning' });
		}
		return Promise.reject(error);
	}
);
