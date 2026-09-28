import type { WheelDiameterApi } from '../wheelDiameter.api';

export type WheelDiameterReader = Pick<WheelDiameterApi, 'fetchWheelDiameters'>;
