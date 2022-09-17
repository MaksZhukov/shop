import { Tire } from 'api/tires/types';
import { Wheel } from 'api/wheels/types';
import { SparePart } from 'api/spareParts/types';
import { Product } from 'api/types';

export interface Favorite {
	id: number;
	product: Product;
}
