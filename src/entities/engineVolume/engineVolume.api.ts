import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { EngineVolumeDto } from './dto/engineVolume.dto';

export const ENGINE_VOLUME_API = Symbol('EngineVolumeApi');

@injectable()
export class EngineVolumeApi {
	fetchEngineVolumes(params?: CollectionParams) {
		return api.get<ApiResponse<EngineVolumeDto[]>>('/engine-volumes', { params });
	}
}

export const engineVolumeApi = new EngineVolumeApi();

