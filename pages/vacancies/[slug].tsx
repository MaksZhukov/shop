import { Layout } from 'api/layout/types';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import { Vacancy as IVacancy } from 'api/vacancies/types';
import { fetchVacancy } from 'api/vacancies/vacancies';
import Card from 'components/Card';

interface Props {
	page: IVacancy;
}

const Vacancy: NextPage<Props> = ({ page }) => <Card data={page}></Card>;

export default Vacancy;

export const getServerSideProps = getPageProps(undefined, async (context) => ({
	page: (await fetchVacancy(context.params?.slug as string)).data.data,
}));
