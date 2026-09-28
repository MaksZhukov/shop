import 'reflect-metadata';
import { computed, withAsyncData, wrap } from '@reatom/core';
import { inject, injectable } from 'inversify';
import type { Review } from 'entities/review';
import { ReviewsService } from './reviews.service';

@injectable()
export class ReviewsStore {
	readonly reviews = computed(async () => {
		return await wrap(this.reviewsService.loadReviews());
	}, 'reviews.list').extend(withAsyncData({ initState: [] as Review[] }));

	constructor(@inject(ReviewsService) private readonly reviewsService: ReviewsService) {}
}
