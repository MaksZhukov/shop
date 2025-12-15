import { api } from 'shared/api';
import { ApiResponse, CollectionParams } from 'shared/api/types';
import { Review } from './reviewTypes';

export const reviewApi = {
	fetchReviews: (params?: CollectionParams) => api.get<ApiResponse<Review[]>>('/reviews', { params })
};



