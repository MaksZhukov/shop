import { createRequestContainer } from 'app/di/app.container';
import { PageService, type PageVacancies } from 'entities/page';
import { VacanciesEntry, VacanciesInjector, VACANCIES_PAGE_QUERY } from 'features/vacancies';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { createModuleInjector } from 'shared/di';
import { VacanciesStore } from 'features/vacancies';

interface Props {
	page: PageVacancies;
}

export const inject = createModuleInjector<typeof VacanciesStore>();

const VacanciesPage = ({ page }: Props) => {
	const vacanciesStore = inject(VacanciesStore);
	vacanciesStore.syncFromServer(page);

	return (
		<VacanciesInjector value={{ vacanciesStore }}>
			<VacanciesEntry />
		</VacanciesInjector>
	);
};

export default VacanciesPage;

export const getStaticProps = getPageProps(undefined, async () => {
	const pageService = createRequestContainer().get(PageService);
	const page = (await pageService.fetchPage('vacancy', VACANCIES_PAGE_QUERY)()).data.data as PageVacancies;

	return {
		props: {
			page,
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'Вакансии', href: '/vacancies' }
			]
		}
	};
});
