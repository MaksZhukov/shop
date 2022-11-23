import { SparePart } from 'api/spareParts/types';
import { Tire } from 'api/tires/types';
import { Product } from 'api/types';
import { Wheel } from 'api/wheels/types';

export const isTire = (data: Product): data is Tire => data.type === 'tire';
export const isWheel = (data: Product): data is Wheel => data.type === 'wheel';
