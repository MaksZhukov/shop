import { useMediaQuery } from '@mui/material';
import { Box } from '@mui/material';
import { Loader, Typography, Link } from 'components/ui';
import { observer } from 'mobx-react';
import Head from 'next/head';
import { getPageProps } from 'services/PagePropsService';
import { useStore } from 'store';
import ProductItem from 'components/features/ProductItem';
import { getViewedProducts } from 'services/LocalStorageService';
import { useQuery } from '@tanstack/react-query';
import { fetchSpareParts } from 'api/spareParts/spareParts';

const Favorites = () => {
	const store = useStore();
	const items = store.favorites.items;
	const isLoading = store.favorites.isLoading;
	const viewedProducts = getViewedProducts();

	const { data: viewedProductsData } = useQuery({
		queryKey: ['viewedProducts'],
		queryFn: () =>
			fetchSpareParts({
				populate: ['images', 'brand'],
				filters: { id: { $in: viewedProducts.map((item) => item.id) } }
			}),
		enabled: !!viewedProducts.length
	});

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
				<Loader></Loader>
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
						<ProductItem imageHeight={215} sx={{ margin: 'initial' }} key={item.id} data={item.product} />
					))}
				</Box>
			) : (
				<Typography variant='subtitle1' marginY='1em' textAlign='center'>
					У вас нет товаров в избранном, добавьте их из <Link href='/'>Магазина</Link>
				</Typography>
			)}

			{viewedProductsData?.data.data.length && (
				<>
					<Typography mt={3} variant='h6' gutterBottom>
						Вы смотрели
					</Typography>
					<Box display='flex' flexWrap='wrap' gap={1}>
						{viewedProductsData.data.data.map((item) => (
							<ProductItem imageHeight={215} sx={{ margin: 'initial' }} key={item.id} data={item} />
						))}
					</Box>
				</>
			)}
		</Box>
	);
};

export default observer(Favorites);

export const getStaticProps = getPageProps();
