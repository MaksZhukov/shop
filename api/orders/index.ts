import getConfig from 'next/config';
import { api } from '..';
import { ApiResponse, ProductType } from '../types';
import { OrderCheckout } from './types';

export const fetchOrderCheckout = (products: { id: number; type: ProductType }[]) =>
    api.get<ApiResponse<OrderCheckout>>(`/orders/checkout`, {
        params: {
            products
        }
    });
