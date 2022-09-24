import { SparePart } from 'api/spareParts/types';
import { Product } from 'api/types';

export const isSparePart = (data: Product): data is SparePart =>
	data.type === 'sparePart';
