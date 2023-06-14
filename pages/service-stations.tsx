import { Typography } from '@mui/material';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import { fetchServiceStations } from 'api/serviceStations/serviceStations';
import { ServiceStation } from 'api/serviceStations/types';
import { ApiResponse } from 'api/types';
import CardItem from 'components/CardItem';
import WhiteBox from 'components/WhiteBox';
import { NextPage } from 'next';
import getConfig from 'next/config';
import { getPageProps } from 'services/PagePropsService';

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
			sort: 'updatedAt:desc'
		})
	).data
}));
