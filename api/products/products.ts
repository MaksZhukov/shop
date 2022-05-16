import { api } from '..';
import { CollectionParams } from '../types';

export const fetchProducts = (params: CollectionParams) =>
    api.get('/products', { params });

export const fetchProduct = (idOrSlug: string) =>
    api.get(`/product/${idOrSlug}`);

const obj = { data: { name: 'Product 3', description: 'Product 3' } };
