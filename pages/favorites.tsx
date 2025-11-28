import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Loader, Typography, Link, Carousel } from 'components/ui';
import { observer } from 'mobx-react';
import Head from 'next/head';
import { getPageProps } from 'services/PagePropsService';
import { useStore } from 'store';
import ProductItem from 'components/features/ProductItem';
import { ViewedProducts } from 'components/features/ViewedProducts';

const Favorites = () => {
	const store = useStore();
	const items = store.favorites.items;
	const isLoading = store.favorites.isLoading;
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	if (isLoading) {
		return (
			<Box paddingY='10em' position='relative'>
				<Loader></Loader>
			</Box>
		);
	}

	if (isLoading) {
		return (
			<Box paddingY='10em' position='relative'>
				<Loader />
			</Box>
		);
	}

	const renderHead = (
		<Head>
			<title>Избранное</title>
			<meta name='description' content='Избранное товары'></meta>
			<meta name='keywords' content='авто, ожидаемые авто, автомобили, ожидаемые автомобили' />
		</Head>
	);

	return (
		<Box pb={6}>
			{renderHead}
			<Typography variant='h6' component='h1' gutterBottom>
				Избранное ({items.length})
			</Typography>
			{items.length ? (
				<Box display='flex' flexWrap='wrap' gap={1}>
					{items.map((item) => (
						<ProductItem
							imageHeight={isMobile ? 272 : 215}
							width={isMobile ? 340 : 280}
							sx={{ margin: 'initial' }}
							key={item.id}
							data={item.product}
						/>
					))}
				</Box>
			) : (
				<Typography variant='subtitle1' my={1}>
					У вас нет товаров в избранном, добавьте их из <Link href='/'>Магазина</Link>
				</Typography>
			)}

			<ViewedProducts />
		</Box>
	);
};

export default observer(Favorites);

export const getStaticProps = getPageProps(undefined, async () => {
	return {
		props: {
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'Избранное', href: '/favorites' }
			]
		}
	};
});
