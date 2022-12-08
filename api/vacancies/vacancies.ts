import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { Vacancy } from './types';

export const fetchVacancies = (params: CollectionParams) =>
	api.get<ApiResponse<Vacancy[]>>('/vacancies', {
		params,
	});

export const fetchVacancy = (slug: string) => api.get<ApiResponse<Vacancy>>(`/vacancies/${slug}`);
