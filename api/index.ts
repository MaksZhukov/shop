import axios from 'axios';
import https from 'https';
import getConfig from 'next/config';
import NotistackService from 'services/NotistackService';
import qs from 'query-string';
import { store } from '../store';
import { ApiResponse } from './types';
const { publicRuntimeConfig } = getConfig();

export const api = axios.create({
	baseURL: publicRuntimeConfig.backendUrl + '/api'
});

export const fetchApi = <T>(url: string, params: any) =>
	fetch(qs.stringifyUrl({ url: publicRuntimeConfig.backendLocalUrl + '/api' + url, query: params }), {
		cache: 'no-store'
	}).then(async (res) => {
		const result = (await res.json()) as ApiResponse<T>;
		return { data: result  };
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
		if (error.response?.status === 429) {
			NotistackService.ref?.enqueueSnackbar('Слишком много запросов, попробуйте позже');
		}
		return Promise.reject(error);
	}
);
