import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Autocomis } from './model/autocomiseModel';

export const autocomiseApi = {
	fetchAutocomises: (params: CollectionParams) =>
		api.get<ApiResponse<Autocomis[]>>('/autocomises', {
			params
		}),
	fetchAutocomis: (slug: string) => api.get<ApiResponse<Autocomis>>(`/autocomises/${slug}`)
};
