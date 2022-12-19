import { CarOnParts } from 'api/cars-on-parts/types';
import { Car } from 'api/cars/types';

export const isCarOnsPartParts = (data: Car | CarOnParts): data is CarOnParts => Object.hasOwn(data, 'price');
