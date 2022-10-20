import { api } from 'api';
import cache from 'services/CacheService';
import { OneNews } from './types';

export const fetchNews = () =>
	!cache.apiNews
		? api<{ data: OneNews[] }>('/api/news', { baseURL: '/' }).then(
				(res) => {
					cache.apiNews = res;
					return res;
				}
		  )
		: Promise.resolve(cache.apiNews);
