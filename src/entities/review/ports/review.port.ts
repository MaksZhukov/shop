import type { ReviewApi } from '../review.api';

export type ReviewReader = Pick<ReviewApi, 'fetchReviews'>;
