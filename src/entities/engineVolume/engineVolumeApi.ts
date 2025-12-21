import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { EngineVolume } from './engineVolumeTypes';

export const engineVolumeApi = {
	fetchEngineVolumes: (params?: CollectionParams) =>
		api.get<ApiResponse<EngineVolume[]>>('/engine-volumes', { params })
};



