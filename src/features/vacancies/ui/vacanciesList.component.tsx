import type { Vacancy } from 'entities/page';
import { VacancyItem } from './vacancyItem.component';

type VacanciesListProps = {
	vacancies: Vacancy[];
};

export const VacanciesList = ({ vacancies }: VacanciesListProps) => (
	<>
		{vacancies.map((vacancy, index) => (
			<VacancyItem key={vacancy.id} vacancy={vacancy} index={index} />
		))}
	</>
);
