import type { CarOnPartsApi } from '../carOnParts.api';

export type CarOnPartsReader = Pick<CarOnPartsApi, 'fetchCarsOnParts' | 'fetchCarOnParts'>;
