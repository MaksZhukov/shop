import { SparePart } from 'api/spareParts/types';
import { Tire } from 'api/tires/types';
import { Product } from 'api/types';
import { Wheel } from 'api/wheels/types';

let SLUG_PRODUCT_TYPE = {
	sparePart: 'spare-parts',
	wheel: 'wheels',
	cabin: 'cabins',
	tire: 'tires',
};

export const isTire = (data: Product): data is Tire => data.type === 'tire';
export const isWheel = (data: Product): data is Wheel => data.type === 'wheel';
export const getProductTypeSlug = (data: Product) => SLUG_PRODUCT_TYPE[data.type];
