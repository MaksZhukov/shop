import { api } from 'api';
import { ApiResponse } from 'api/types';
import getConfig from 'next/config';
import Parser from 'rss-parser';
import { OneNews } from './types';
let parser = new Parser();
const { publicRuntimeConfig } = getConfig();

export const fetchNews = (): Promise<ApiResponse<{ items: OneNews[] }>> =>
	api('/api/news', { baseURL: '/' }) as any;
