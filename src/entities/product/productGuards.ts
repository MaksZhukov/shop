import type { Brand } from 'entities/brand/brandTypes';
import type { Cabin } from 'entities/cabin';
import type { SparePart } from 'entities/sparePart';
import type { TireBrand } from 'entities/tireBrand';
import type { Tire } from 'entities/tire';
import type { Product } from './productTypes';
import type { Wheel } from 'entities/wheel';

export const isTire = (data: Product): data is Tire => data.type === 'tire';
export const isSparePart = (data: Product): data is SparePart => data.type === 'sparePart';
export const isCabin = (data: Product): data is Cabin => data.type === 'cabin';
//@ts-expect-error error
export const isTireBrand = (data: TireBrand | Brand | undefined): data is TireBrand => data.productBrandText;
export const isWheel = (data: Product): data is Wheel => data.type === 'wheel';
