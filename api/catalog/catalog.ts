import { api } from 'api';
import { ApiResponse } from 'api/types';
import { TopCategory } from './types';

export const fetchTopCategories = () => api.get<ApiResponse<TopCategory[]>>(`/catalog/top-categories`);
