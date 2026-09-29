import { reatomComponent } from '@reatom/react';
import { AsyncWrapper } from 'shared/ui';
import { useDI } from '../vacancies.di';
import { VacanciesList } from './vacanciesList.component';
import { VacanciesLoading } from './vacanciesLoading.component';

export const VacanciesEntry = reatomComponent(() => {
	const { vacanciesStore } = useDI();
	const page = vacanciesStore.page.data();
	const isLoading = !vacanciesStore.page.ready() && page.vacancies.length === 0;

	return (
		<AsyncWrapper loading={isLoading} fallback={<VacanciesLoading />}>
			<VacanciesList vacancies={page.vacancies} />
		</AsyncWrapper>
	);
});
