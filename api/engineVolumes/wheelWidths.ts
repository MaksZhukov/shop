import { api } from '..';
import { ApiResponse, CollectionParams } from '../types';
import { EngineVolume } from './types';

export const fetchEngineVolumes = (params?: CollectionParams) =>
	api.get<ApiResponse<EngineVolume[]>>('/engine-volumes', { params });
