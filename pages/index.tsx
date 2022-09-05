import type { NextPage } from 'next';
import {
	Box,
	Container,
	Input,
	MenuItem,
	Pagination,
	Select,
	SelectChangeEvent,
	Typography,
	useMediaQuery,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Product } from '../api/products/types';
import { useRouter } from 'next/router';
import useThrottle from '@rooks/use-throttle';
import classNames from 'classnames';
import ProductItem from 'components/ProductItem';
import { fetchProducts } from 'api/products/products';
import Reviews from 'components/Reviews';
import WhiteBox from 'components/WhiteBox';
import Filters from 'components/Filters';
import NewProducts from 'components/NewProducts';

const selectSortItems = [
	{ name: 'Новые', value: 'createdAt:desc' },
	{ name: 'Старые', value: 'createdAt:asc' },
	{ name: 'Дешевые', value: 'price:asc' },
	{ name: 'Дорогие', value: 'price:desc' },
];

const Home: NextPage = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>('');
	const [pageCount, setPageCount] = useState<number>(0);
	const router = useRouter();

	const isTablet = useMediaQuery((theme: any) =>
		theme.breakpoints.down('md')
	);

	const {
		searchValue: querySearchValue = '',
		min = '',
		max = '',
		brandId = '',
		modelId = '',
		sparePartId = '',
		yearTo = '',
		yearFrom = '',
		fuel = '',
		bodyStyle = '',
		transmission = '',
		sort = 'createdAt:desc',
		page = '1',
	} = router.query as {
		searchValue: string;
		min: string;
		max: string;
		brandId: string;
		modelId: string;
		sparePartId: string;
		yearFrom: string;
		yearTo: string;
		fuel: string;
		bodyStyle: string;
		transmission: string;
		sort: string;
		page: string;
	};

	const [throttledFetchProducts] = useThrottle(async () => {
		setIsLoading(true);
		const {
			data: {
				data,
				meta: { pagination },
			},
		} = await fetchProducts({
			filters: {
				name: { $contains: searchValue },
				price: { $gte: min || '0', $lte: max || undefined },
				brand: brandId || undefined,
				model: modelId || undefined,
				sparePart: sparePartId || undefined,
				year: {
					$gte: yearFrom || undefined,
					$lte: yearTo || undefined,
				},
				transmission: transmission || undefined,
				fuel: fuel || undefined,
				bodyStyle: bodyStyle || undefined,
			},
			pagination: searchValue ? {} : { page: +page },
			populate: ['images', 'model', 'brand', 'sparePart'],
			sort,
		});
		setProducts(data);
		if (pagination) {
			setPageCount(pagination.pageCount);
			if (pagination.pageCount < +page) {
				router.query.page = (pagination.pageCount || 1).toString();
				router.push({ pathname: router.pathname, query: router.query });
			}
			setTotal(pagination.total);
		}
		setIsLoading(false);
	}, 300);

	const [throttledChangeRouterQuery] = useThrottle(
		(field: string, value: string) => {
			router.query[field] = value;
			router.replace({ pathname: router.pathname, query: router.query });
		},
		100
	);

	useEffect(() => {
		if (router.isReady) {
			throttledFetchProducts();
			setSearchValue(querySearchValue);
		}
	}, [sort, page, router.isReady]);

	const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
		throttledChangeRouterQuery('searchValue', e.target.value);
	};

	const handleChangeSort = (e: SelectChangeEvent<HTMLInputElement>) => {
		router.query.sort = e.target.value as string;
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleChangePage = (_: any, newPage: number) => {
		router.query.page = newPage.toString();
		router.push({ pathname: router.pathname, query: router.query });
	};

	return (
		<Container>
			<Box
				className={classNames(
					styles.wrapper,
					isTablet && styles.wrapper_tablet
				)}>
				<Box
					marginRight='1em'
					component='aside'
					className={classNames(
						styles.sider,
						isTablet && styles.sider_tablet
					)}>
					<Filters
						total={total}
						fetchData={throttledFetchProducts}></Filters>
					<Reviews></Reviews>
				</Box>
				<Box
					className={classNames(
						styles.content,
						isTablet && styles.content_tablet
					)}>
					<WhiteBox display='flex'>
						<Input
							className={styles['search']}
							onChange={handleChangeSearch}
							value={searchValue}
							placeholder='Поиск детали ...'
							fullWidth></Input>
						<Select
							variant='standard'
							value={sort as any}
							fullWidth
							className={styles['sort-select']}
							onChange={handleChangeSort}>
							{selectSortItems.map((item) => (
								<MenuItem key={item.name} value={item.value}>
									{item.name}
								</MenuItem>
							))}
						</Select>
					</WhiteBox>
					<WhiteBox
						className={classNames({
							[styles['loading']]: isLoading,
							[styles['content-items_no-data']]: !products.length,
						})}>
						{products.length ? (
							products.map((item) => (
								<ProductItem
									key={item.id}
									data={item}></ProductItem>
							))
						) : (
							<Typography textAlign='center' variant='h5'>
								Данных не найдено
							</Typography>
						)}
					</WhiteBox>
					{!!products.length && (
						<WhiteBox display='flex' justifyContent='center'>
							<Pagination
								page={+page}
								siblingCount={2}
								color='primary'
								count={pageCount}
								onChange={handleChangePage}
								variant='outlined'
							/>
						</WhiteBox>
					)}
				</Box>
			</Box>
			<NewProducts></NewProducts>
		</Container>
	);
};

export default Home;
