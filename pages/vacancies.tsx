import { Typography } from '@mui/material';
import { ApiResponse } from 'api/types';
import WhiteBox from 'components/WhiteBox';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import { fetchVacancies } from 'api/vacancies/vacancies';
import { Vacancy } from 'api/vacancies/types';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import Card from 'components/Card';

interface Props {
	page: DefaultPage;
	vacancies: ApiResponse<Vacancy[]>;
}

const Vacancies: NextPage<Props> = ({ page, vacancies }) => {
	return (
		<WhiteBox>
			<Typography textAlign='center' component='h1' variant='h4' marginBottom='1em'>
				{page.seo?.h1}
			</Typography>
			{vacancies.data.map((item) => (
				<Card
					name={item.name}
					key={item.id}
					image={item.image}
					link={`/vacancies/${item.slug}`}
					description={item.description}
				></Card>
			))}
		</WhiteBox>
	);
};

export default Vacancies;

export const getStaticProps = getPageProps(fetchPage('vacancy'), async () => ({
	vacancies: (
		await fetchVacancies(
			{
				populate: 'image',
			}
		)
	).data,
}));
