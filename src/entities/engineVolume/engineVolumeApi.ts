import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { EngineVolumeDto } from './dto/engineVolume.dto';

export const engineVolumeApi = {
	fetchEngineVolumes: (params?: CollectionParams) =>
		api.get<ApiResponse<EngineVolumeDto[]>>('/engine-volumes', { params })
};



