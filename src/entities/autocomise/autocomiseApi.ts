import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { Autocomis } from './autocomiseTypes';

export const autocomiseApi = {
	fetchAutocomises: (params: CollectionParams) =>
		api.get<ApiResponse<Autocomis[]>>('/autocomises', {
			params
		}),
	fetchAutocomis: (slug: string) => api.get<ApiResponse<Autocomis>>(`/autocomises/${slug}`)
};
