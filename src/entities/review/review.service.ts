import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { REVIEW_API, ReviewApi } from './review.api';
import type { ReviewReader } from './ports/review.port';
import type { CollectionParams } from 'shared/api/types';

@injectable()
export class ReviewService implements ReviewReader {
	constructor(@inject(REVIEW_API) private readonly reviewApi: ReviewApi) {}

	fetchReviews(params?: CollectionParams) {
		return this.reviewApi.fetchReviews(params);
	}
}
