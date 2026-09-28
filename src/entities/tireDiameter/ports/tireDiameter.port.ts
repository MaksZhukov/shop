import type { TireDiameterApi } from '../tireDiameter.api';

export type TireDiameterReader = Pick<TireDiameterApi, 'fetchTireDiameters'>;
