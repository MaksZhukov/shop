import { Typography } from '@mui/material';
import { fetchAutocomises } from 'api/autocomises/autocomises';
import { Autocomis } from 'api/autocomises/types';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import { ApiResponse } from 'api/types';
import CardItem from 'components/CardItem';
import WhiteBox from 'components/WhiteBox';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	page: DefaultPage;
	autocomises: ApiResponse<Autocomis[]>;
}

const Vacancies: NextPage<Props> = ({ page, autocomises }) => {
	return (
		<WhiteBox>
			<Typography textAlign='center' component='h1' variant='h4' marginBottom='1em'>
				{page.seo?.h1 || 'Автокомисы'}
			</Typography>
			{autocomises.data.map((item) => (
				<CardItem
					key={item.id}
					description={item.description}
					name={item.name}
					image={item.image}
					link={`/autocomises/${item.slug}`}
				></CardItem>
			))}
		</WhiteBox>
	);
};

export default Vacancies;

export const getStaticProps = getPageProps(fetchPage('autocomis'), async () => ({
	autocomises: (
		await fetchAutocomises({
			populate: 'image',
			sort: 'updatedAt:desc'
		})
	).data
}));
