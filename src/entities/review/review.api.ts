import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { Review } from './model/review.model';

export const REVIEW_API = Symbol('ReviewApi');

@injectable()
export class ReviewApi {
	fetchReviews(params?: CollectionParams) {
		return api.get<ApiResponse<Review[]>>('/reviews', { params });
	}
}

export const reviewApi = new ReviewApi();

