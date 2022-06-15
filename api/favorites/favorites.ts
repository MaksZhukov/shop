import { api } from '..';
import { ApiResponse } from '../types';
import { Favorite } from './types';

export const getFavorites = () =>
    api.get<ApiResponse<Favorite[]>>('favorites');

export const addToFavorites = (productId: number) =>
    api.post<ApiResponse<Favorite>>('favorites', {
        data: { product: productId },
    });

export const removeFromFavorites = (id: number) =>
    api.delete<ApiResponse<Favorite>>(`favorites/${id}`);
