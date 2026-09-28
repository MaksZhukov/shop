import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ReviewService } from 'entities/review';
import { SnackbarService } from 'shared/services';

const LOAD_ERROR = 'Произошла какая-то ошибка с загрузкой отзывов, обратитесь в поддержку';

@injectable()
export class ReviewsService {
	constructor(
		@inject(ReviewService) private readonly reviewService: ReviewService,
		@inject(SnackbarService) private readonly snackbarService: SnackbarService
	) {}

	async loadReviews() {
		try {
			return await this.reviewService.fetchReviews();
		} catch {
			this.snackbarService.error(LOAD_ERROR);
			throw new Error(LOAD_ERROR);
		}
	}
}
