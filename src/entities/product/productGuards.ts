import { Brand } from 'entities/brand/brandTypes';
import { SparePart } from 'entities/sparePart';
import { TireBrand } from 'entities/tireBrand';
import { Tire } from 'entities/tire';
import { Product } from './productTypes';
import { Wheel } from 'entities/wheel';

export const isTire = (data: Product): data is Tire => data.type === 'tire';
export const isSparePart = (data: Product): data is SparePart => data.type === 'sparePart';
//@ts-expect-error error
export const isTireBrand = (data: TireBrand | Brand | undefined): data is TireBrand => data.productBrandText;
export const isWheel = (data: Product): data is Wheel => data.type === 'wheel';
