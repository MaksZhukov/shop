import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { Model } from './types';

export const getModels = (params: CollectionParams) =>
	api.get<ApiResponse<Model[]>>('/models', { params });
