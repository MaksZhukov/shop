import { Box, Link, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { ApiResponse, MetaResponse } from 'api/types';
import HeadSEO from 'components/HeadSEO';
import Image from 'components/Image';
import SEOBox from 'components/SEOBox';
import WhiteBox from 'components/WhiteBox';
import { NextPage } from 'next';
import getConfig from 'next/config';
import { getPageProps } from 'services/PagePropsService';
import NextLink from 'next/link';
import { fetchAutocomises } from 'api/autocomises/autocomises';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import { ServiceStation } from 'api/serviceStations/types';
import CardItem from 'components/CardItem';
import { fetchServiceStations } from 'api/serviceStations/serviceStations';

const { publicRuntimeConfig } = getConfig();

interface Props {
	page: DefaultPage;
	serviceStations: ApiResponse<ServiceStation[]>;
}

const Vacancies: NextPage<Props> = ({ page, serviceStations }) => {
	return (
		<WhiteBox>
			<Typography textAlign='center' component='h1' variant='h4' marginBottom='1em'>
				{page.seo?.h1 || 'СТО'}
			</Typography>
			{serviceStations.data.map((item) => (
				<CardItem
					key={item.id}
					name={item.name}
					description={item.description}
					image={item.image}
					link={`/service-stations/${item.slug}`}
				></CardItem>
			))}
		</WhiteBox>
	);
};

export default Vacancies;

export const getStaticProps = getPageProps(fetchPage('service-station'), async () => ({
	serviceStations: (
		await fetchServiceStations({
			populate: 'image',
			sort: 'updatedAt:desc',
		})
	).data,
}));
