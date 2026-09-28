import type { CartApi } from '../cart.api';

export type CartReader = Pick<CartApi, 'fetchShoppingCart' | 'addToShoppingCart' | 'removeFromShoppingCart' | 'removeFromShoppingCartMany'>;
