import 'reflect-metadata';
import { injectable } from 'inversify';
import { api } from 'shared/api';
import type { ApiResponse, CollectionParams } from 'shared/api/types';
import type { ReviewDto } from './dto/review.dto';

export const REVIEW_API = Symbol('ReviewApi');

@injectable()
export class ReviewApi {
	fetchReviews(params?: CollectionParams) {
		return api.get<ApiResponse<ReviewDto[]>>('/reviews', { params });
	}
}
