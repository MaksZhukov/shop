import { reatomComponent } from '@reatom/react';
import { useDI } from '../vacancies.di';
import { VacanciesList } from './vacanciesList.component';
import { VacanciesLoading } from './vacanciesLoading.component';

export const VacanciesEntry = reatomComponent(() => {
	const { vacanciesStore } = useDI();
	const page = vacanciesStore.page.data();
	const isLoading = !vacanciesStore.page.ready() && page.vacancies.length === 0;

	if (isLoading) {
		return <VacanciesLoading />;
	}

	return <VacanciesList vacancies={page.vacancies} />;
});
