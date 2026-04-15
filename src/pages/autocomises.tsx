import { Typography } from '@mui/material';
import { autocomiseApi } from 'entities/autocomise';
import { Autocomis } from 'entities/autocomise';
import { pageApi, DefaultPage } from 'entities/page';
import type { ApiResponse } from 'shared/api/types';
import { CardItem } from 'shared/ui';
import { WhiteBox } from 'shared/ui';
import { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: DefaultPage;
	autocomises: ApiResponse<Autocomis[]>;
}

const Vacancies: NextPage<Props> = ({ page, autocomises }) => {
	return (
        <WhiteBox>
            <Typography
                component='h1'
                variant='h4'
                sx={{
                    textAlign: 'center',
                    marginBottom: '1em'
                }}>
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

export const getStaticProps = getPageProps(pageApi.fetchPage('autocomis'), async () => ({
	props: {
		autocomises: (
			await autocomiseApi.fetchAutocomises({
				populate: 'image',
				sort: 'updatedAt:desc'
			})
		).data,
		breadcrumbs: [
			{ text: 'Главная', href: '/' },
			{ text: 'Автокомисы', href: '/autocomises' }
		]
	}
}));
