import { api } from 'shared/api';
import type { ApiResponse } from 'shared/api/types';
import type { TopCategoryDto } from './dto/catalog.dto';

export const catalogApi = {
	fetchTopCategories: () => api.get<ApiResponse<TopCategoryDto[]>>(`/catalog/top-categories`)
};



