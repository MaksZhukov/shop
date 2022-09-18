import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import Parser from 'rss-parser';
import { OneNews } from './types';

export const fetchNews = (): Promise<ApiResponse<{ items: OneNews[] }>> =>
	api('/api/news', { baseURL: '/' }) as any;
