import { api } from 'shared/api';
import { ApiResponse } from 'shared/api/types';
import { TopCategory } from './catalogTypes';

export const catalogApi = {
	fetchTopCategories: () => api.get<ApiResponse<TopCategory[]>>(`/catalog/top-categories`)
};



