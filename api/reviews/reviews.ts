import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { Review } from './types';

export const fetchReviews = (params?: CollectionParams) => api.get<ApiResponse<Review[]>>('/reviews', { params });
