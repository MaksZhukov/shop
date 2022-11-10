import { SparePart } from 'api/spareParts/types';
import { Product } from 'api/types';
import { Wheel } from 'api/wheels/types';


export const isWheel = (data: Product): data is Wheel => data.type === 'wheel';
