import { Product } from '../products/types'

export interface Favorite {
    id: number;
	uuid: string;
    product: Product
}