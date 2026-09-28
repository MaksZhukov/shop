import { createRequestContainer } from 'app/di/app.container';
import { Typography } from '@mui/material';
import { PageService, DefaultPage } from 'entities/page';
import { ServiceStationService, ServiceStation } from 'entities/serviceStation';
import type { ApiResponse } from 'shared/api/types';
import { CardItem } from 'shared/ui';
import { WhiteBox } from 'shared/ui';
import { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: DefaultPage;
	serviceStations: ApiResponse<ServiceStation[]>;
}

const Vacancies: NextPage<Props> = ({ page, serviceStations }) => {
	return (
        <WhiteBox>
            <Typography
                component='h1'
                variant='h4'
                sx={{
                    textAlign: 'center',
                    marginBottom: '1em'
                }}>
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

export const getStaticProps = getPageProps(undefined, async () => {
	const container = createRequestContainer();
	const pageService = container.get(PageService);
	const serviceStationService = container.get(ServiceStationService);
	const page = (await pageService.fetchPage('service-station')()).data.data;

	return {
		props: {
			page,
			serviceStations: (
				await serviceStationService.fetchServiceStations({
					populate: 'image',
					sort: 'updatedAt:desc'
				})
			).data,
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'СТО', href: '/service-stations' }
			]
		}
	};
});
