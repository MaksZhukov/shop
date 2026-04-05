import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Review } from './model/reviewModel';

export const reviewApi = {
	fetchReviews: (params?: CollectionParams) => api.get<ApiResponse<Review[]>>('/reviews', { params })
};



