import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ENGINE_VOLUME_API, EngineVolumeApi } from './engineVolume.api';
import type { EngineVolumeReader } from './ports/engineVolume.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class EngineVolumeService implements EngineVolumeReader {
	constructor(@inject(ENGINE_VOLUME_API) private readonly engineVolumeApi: EngineVolumeApi) {}

	fetchEngineVolumes(params?: CollectionParams) {
		return this.engineVolumeApi.fetchEngineVolumes(params);
	}
}
