import type { EngineVolumeApi } from '../engineVolume.api';

export type EngineVolumeReader = Pick<EngineVolumeApi, 'fetchEngineVolumes'>;
