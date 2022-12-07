import { Box, Link, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { ApiResponse, MetaResponse } from 'api/types';
import HeadSEO from 'components/HeadSEO';
import Image from 'components/Image';
import SEOBox from 'components/SEOBox';
import WhiteBox from 'components/WhiteBox';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import NextLink from 'next/link';
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
			},
			true
		)
	).data,
}));
