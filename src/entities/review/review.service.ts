import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import type { CollectionParams } from 'shared/api/types';
import { REVIEW_API, ReviewApi } from './review.api';
import type { ReviewDto } from './dto/review.dto';
import type { Review } from './model/review.model';
import type { ReviewReader } from './ports/review.port';

const mapReview = (review: ReviewDto): Review => ({ ...review });

@injectable()
export class ReviewService implements ReviewReader {
	constructor(@inject(REVIEW_API) private readonly reviewApi: ReviewApi) {}

	async fetchReviews(params?: CollectionParams) {
		const { data } = await this.reviewApi.fetchReviews(params);
		return data.data.map(mapReview);
	}
}
