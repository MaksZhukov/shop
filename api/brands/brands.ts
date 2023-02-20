import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { Brand } from './types';

export const fetchBrands = (params: CollectionParams) =>
    api.get<ApiResponse<Brand[]>>('/brands', {
        params
    });

export const fetchBrandBySlug = (slug: string, params: CollectionParams) =>
    api.get<ApiResponse<Brand>>(`/brands/${slug}`, { params: { field: 'slug', ...params } });
