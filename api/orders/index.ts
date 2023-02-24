import getConfig from 'next/config';
import { api } from '..';
import { ApiResponse, ProductType } from '../types';
import { OrderCheckout } from './types';

export const fetchOrderCheckout = (id: number, type: ProductType) =>
    api.get<ApiResponse<OrderCheckout>>(`/orders/checkout/${id}`, {
        params: {
            type
        }
    });
