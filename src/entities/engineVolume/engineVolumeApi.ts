import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { EngineVolume } from './engineVolumeTypes';

export const engineVolumeApi = {
	fetchEngineVolumes: (params?: CollectionParams) =>
		api.get<ApiResponse<EngineVolume[]>>('/engine-volumes', { params })
};



