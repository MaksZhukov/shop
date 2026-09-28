import type { CarApi } from '../car.api';

export type CarReader = Pick<CarApi, 'fetchCars' | 'fetchCar'>;
