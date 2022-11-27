import { api } from 'api';
import { NextRequest } from 'next/server';
import cache from 'services/CacheService';
import { OneNews } from './types';

export const fetchNews = () =>
	api<{ data: OneNews[] }>('api/news', {
		baseURL:
			process.env.NODE_ENV === 'development'
				? 'http://localhost:3000'
				: 'https://razbor-auto.by',
	}).then((res) => {
		cache.apiNews = res;
		return res;
	});
