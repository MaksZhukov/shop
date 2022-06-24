import { ApiRounded } from '@mui/icons-material';
import { api } from 'api';
import { ApiResponse, CollectionParams } from 'api/types';
import { ReviewStatus } from 'store/User';
import { Review } from './types';

export const addReview = (data: Omit<Review, 'id' | 'publishedAt'>) =>
	api.post<ApiResponse<Review>>('/reviews', { data });

export const fetchReviews = (params: CollectionParams) =>
	api.get<ApiResponse<Review[]>>('/reviews', { params });

export const checkReviewStatus = (email: string) =>
	api.get<ApiResponse<{ status: ReviewStatus }>>('/reviews/check', {
		params: { email },
	});
