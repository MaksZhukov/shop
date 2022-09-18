import axios from 'axios';
import getConfig from 'next/config';
import { store } from '../store';
import qs from 'qs';
import { setupCache } from 'axios-cache-adapter';
const { publicRuntimeConfig } = getConfig();

const cache = setupCache({
	maxAge: 15 * 60 * 1000,
	exclude: {
		paths: [publicRuntimeConfig.backendUrl],
	},
});

export const api = axios.create({
	adapter: cache.adapter,
	baseURL: publicRuntimeConfig.backendUrl + '/api',
	paramsSerializer(params) {
		return qs.stringify(params, { encodeValuesOnly: true });
	},
});

api.interceptors.request.use((config) => {
	if (store.user.jwt && config.headers) {
		config.headers.Authorization = 'Bearer ' + store.user.jwt;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === 401) {
			if (store.user.id) {
				store.user.logout();
			}
		}
		if (error.response.status === 429) {
			store.notification.showMessage({
				message: 'Слишком много запросов, попробуйте позже',
			});
		}
		return Promise.reject(error);
	}
);
