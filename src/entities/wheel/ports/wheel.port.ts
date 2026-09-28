import type { WheelApi } from '../wheel.api';

export type WheelReader = Pick<WheelApi, 'fetchWheels' | 'fetchWheel'>;
