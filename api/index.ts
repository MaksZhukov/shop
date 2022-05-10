import axios from 'axios';
import getConfig from 'next/config';
import { store } from '../store';

const { publicRuntimeConfig } = getConfig();

export const api = axios.create({
    baseURL: publicRuntimeConfig.backendUrl,
});

api.interceptors.request.use((config) => {
    if (store.user.jwt && config.headers) {
        config.headers.Authorization = 'Bearer ' + store.user.jwt;
    }
    return config;
});
