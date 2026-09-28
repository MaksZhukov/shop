import type { CollectionParams } from 'shared/api/types';
import type { Review } from '../model/review.model';

export interface ReviewReader {
	fetchReviews(params?: CollectionParams): Promise<Review[]>;
}
