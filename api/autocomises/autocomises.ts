import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { Autocomis } from './types';

export const fetchAutocomises = (params: CollectionParams) =>
	api.get<ApiResponse<Autocomis[]>>('/autocomises', {
		params,
	});

export const fetchAutocomis = (slug: string) => api.get<ApiResponse<Autocomis>>(`/autocomises/${slug}`);
