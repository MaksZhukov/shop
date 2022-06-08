import type { NextPage } from 'next';
import {
	AppBar,
	Button,
	Card,
	CardContent,
	CardMedia,
	Container,
	IconButton,
	Input,
	MenuItem,
	Modal,
	Pagination,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { login } from '../api/user/user';
import styles from './index.module.scss';
import { Box } from '@mui/system';
import { Product } from '../api/products/types';
import { useRouter } from 'next/router';
import useThrottle from '@rooks/use-throttle';
import getConfig from 'next/config';
import classNames from 'classnames';
import ProductItem from 'components/ProductItem';
import { fetchProducts } from 'api/products/products';

const { publicRuntimeConfig } = getConfig();

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
			populate: 'image',
			publicationState: 'preview',
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

	const handleChangePage = (
		e: MouseEvent<HTMLButtonElement>,
		newPage: number
	) => {
		router.query.page = newPage.toString();
		router.push({ pathname: router.pathname, query: router.query });
	};

	const handleClickFind = () => {
		throttledFetchProducts();
	};

	const handleClickMore = (slug: string) => () => {
		router.push('/products/' + slug);
	};

	return (
		<Container>
			<Box
				padding='3em 1em'
				alignItems='baseline'
				className={styles.wrapper}>
				<Box
					marginRight='1em'
					component='aside'
					className={styles.sider}>
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
				</Box>
				<Box className={styles.content}>
					<Box
						display='flex'
						marginBottom='1em'
						className={styles['content__header']}>
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
					</Box>
					<Box
						marginBottom='1em'
						className={classNames(styles['content__products'], {
							[styles['content__products_loading']]: isLoading,
						})}>
						{products.map((item) => (
							<ProductItem
								key={item.id}
								data={item}></ProductItem>
						))}
					</Box>
					<Box
						className={styles['content__pagination']}
						display='flex'
						justifyContent='center'>
						<Pagination
							page={+page}
							siblingCount={2}
							color='primary'
							count={pageCount}
							onChange={handleChangePage}
							variant='outlined'
						/>
					</Box>
				</Box>
			</Box>
		</Container>
	);
};

export default Home;
