import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { Autocomis } from './types';

export const fetchAutocomises = (
	params: CollectionParams,
	isServerRequest: boolean = false
) =>
	api.get<ApiResponse<Autocomis[]>>('/autocomises', {
		params,
		headers: { isServerRequest },
	});

export const fetchAutocomis = (slug: string, isServerRequest = false) =>
	api.get<ApiResponse<Autocomis>>(`/autocomises/${slug}`, {
		headers: { isServerRequest },
	});
