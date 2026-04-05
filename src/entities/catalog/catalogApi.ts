import { api } from 'shared/api';
import type { ApiResponse } from 'shared/api/types';
import type { TopCategory } from './model/catalogModel';

export const catalogApi = {
	fetchTopCategories: () => api.get<ApiResponse<TopCategory[]>>(`/catalog/top-categories`)
};



