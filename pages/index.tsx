import type { NextPage } from 'next';
import {
	Box,
	Button,
	Container,
	Input,
	MenuItem,
	Pagination,
	Select,
    Link,
	SelectChangeEvent,
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

const selectSortItems = [
	{ name: 'Новые', value: 'createdAt:desc' },
	{ name: 'Старые', value: 'createdAt:asc' },
	{ name: 'Дешевые', value: 'price:asc' },
	{ name: 'Дорогие', value: 'price:desc' },
];

const Home: NextPage = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [pageCount, setPageCount] = useState<number>(0);
	const router = useRouter();

	const {
		searchValue = '',
		min = '',
		max = '',
		sort = 'createdAt:desc',
		page = '1',
	} = router.query as {
		searchValue: string;
		min: string;
		max: string;
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
			},
			pagination: searchValue ? {} : { page: +page },
			populate: 'images',
			sort,
		});
		setProducts(data);
		if (pagination) {
			setPageCount(pagination.pageCount);
			if (pagination.pageCount < +page) {
				router.query.page = (pagination.pageCount || 1).toString();
				router.push({ pathname: router.pathname, query: router.query });
			}
		}
		setIsLoading(false);
	}, 300);

	useEffect(() => {
		if (router.isReady) {
			throttledFetchProducts();
		}
	}, [sort, page, router.isReady]);

	const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
		router.query.searchValue = e.target.value;
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleChangeMin = (e: ChangeEvent<HTMLInputElement>) => {
		router.query.min = e.target.value;
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleChangeMax = (e: ChangeEvent<HTMLInputElement>) => {
		router.query.max = e.target.value;
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleChangeSort = (e: SelectChangeEvent<HTMLInputElement>) => {
		router.query.sort = e.target.value as string;
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleChangePage = (_, newPage: number) => {
		router.query.page = newPage.toString();
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleClickFind = () => {
		throttledFetchProducts();
	};

	return (
		<Container>
			<Box alignItems='baseline' className={styles.wrapper}>
				<Box
					marginRight='1em'
					component='aside'
					className={styles.sider}>
					<WhiteBox>
						<Box display='flex'>
							<Input
								onChange={handleChangeMin}
								value={min}
								placeholder='Цена от руб'
								type='number'></Input>
							<Input
								onChange={handleChangeMax}
								value={max}
								placeholder='Цена до руб'
								type='number'></Input>
						</Box>
						<Box marginTop='1em' textAlign='center'>
							<Button
								onClick={handleClickFind}
								fullWidth
								variant='contained'>
								Найти
							</Button>
						</Box>
					</WhiteBox>
					<Reviews></Reviews>
				</Box>
				<Box className={styles.content}>
					<WhiteBox display='flex'>
						<Input
							className={styles['search']}
							value={searchValue}
							onChange={handleChangeSearch}
							placeholder='Поиск детали ...'
							fullWidth></Input>
						<Select
							variant='standard'
							value={sort}
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
						})}>
						{products.map((item) => (
							<ProductItem
								key={item.id}
								data={item}></ProductItem>
						))}
					</WhiteBox>
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
				</Box>
			</Box>
		</Container>
	);
};

export default Home;
