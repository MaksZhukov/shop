import { api } from 'api';
import { ApiResponse } from 'api/types';
import { getRandomBackendLocalUrl } from 'services/BackendUrlService';
import { Layout, TopCategory } from './types';

export const fetchTopCategories = () => api.get<ApiResponse<TopCategory[]>>(`/catalog/top-categories`);
