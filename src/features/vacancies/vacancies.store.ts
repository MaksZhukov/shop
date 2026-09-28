import 'reflect-metadata';
import { atom, computed, withAsyncData, wrap } from '@reatom/core';
import { inject, injectable } from 'inversify';
import type { PageVacancies } from 'entities/page';
import { VacanciesService } from './vacancies.service';

const emptyPage: PageVacancies = {
	seo: null,
	vacancies: []
};

@injectable()
export class VacanciesStore {
	private readonly serverDataAtom = atom<PageVacancies | null>(null, 'vacancies.serverData');

	readonly page = computed(async () => {
		const serverData = this.serverDataAtom();
		if (serverData !== null) {
			return serverData;
		}
		return await wrap(this.vacanciesService.loadVacanciesPage());
	}, 'vacancies.page').extend(withAsyncData({ initState: emptyPage }));

	constructor(@inject(VacanciesService) private readonly vacanciesService: VacanciesService) {}

	syncFromServer(page: PageVacancies) {
		this.serverDataAtom.set(page);
	}
}
