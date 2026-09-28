import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { PageService, type PageVacancies } from 'entities/page';
import { SnackbarService } from 'shared/services';
import { VACANCIES_PAGE_QUERY } from './vacancies.constants';

const LOAD_ERROR = 'Произошла какая-то ошибка с загрузкой вакансий, обратитесь в поддержку';

@injectable()
export class VacanciesService {
	constructor(
		@inject(PageService) private readonly pageService: PageService,
		@inject(SnackbarService) private readonly snackbarService: SnackbarService
	) {}

	async loadVacanciesPage() {
		try {
			return (await this.pageService.fetchPage('vacancy', VACANCIES_PAGE_QUERY)()).data.data as PageVacancies;
		} catch {
			this.snackbarService.error(LOAD_ERROR);
			throw new Error(LOAD_ERROR);
		}
	}
}
