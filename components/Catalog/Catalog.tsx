import {
	Alert,
	Input,
	MenuItem,
	Pagination,
	Select,
	SelectChangeEvent,
	Typography,
	useMediaQuery,
} from '@mui/material';
import { Box } from '@mui/system';
import useThrottle from '@rooks/use-throttle';
import { Product } from 'api/types';
import { ApiResponse, CollectionParams, Image } from 'api/types';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import Filters from 'components/Filters';
import { AutocompleteType, NumberType } from 'components/Filters/types';
import NewProducts from 'components/NewProducts';
import News from 'components/News';
import ProductItem from 'components/ProductItem';
import Reviews from 'components/Reviews';
import WhiteBox from 'components/WhiteBox';
import { useRouter } from 'next/router';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useStore } from 'store';
import styles from './Catalog.module.scss';

const selectSortItems = [
	{ name: 'Новые', value: 'createdAt:desc' },
	{ name: 'Старые', value: 'createdAt:asc' },
	{ name: 'Дешевые', value: 'price:asc' },
	{ name: 'Дорогие', value: 'price:desc' },
];
interface Props {
	title: string;
	dataFieldsToShow: { id: string; name: string }[];
	filtersConfig: (AutocompleteType | NumberType)[][];
	generateFiltersByQuery: (filter: { [key: string]: string }) => any;
	fetchData: (
		params: CollectionParams
	) => Promise<AxiosResponse<ApiResponse<Product[]>>>;
}

const Catalog = ({
	fetchData,
	title,
	dataFieldsToShow,
	filtersConfig,
	generateFiltersByQuery,
}: Props) => {
	const [data, setData] = useState<Product[]>([]);
	const [total, setTotal] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFirstDataLoaded, setIsFirstDataLoaded] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>('');
	const [pageCount, setPageCount] = useState<number>(0);

	const isTablet = useMediaQuery((theme: any) =>
		theme.breakpoints.down('md')
	);
	const store = useStore();
	const router = useRouter();

	const {
		searchValue: querySearchValue = '',
		sort = 'createdAt:desc',
		page = '1',
		...othersQuery
	} = router.query as {
		searchValue: string;
		sort: string;
		page: string;
		[key: string]: string;
	};

	const [throttledFetchProducts] = useThrottle(async () => {
		setIsLoading(true);
		try {
			const {
				data: {
					data: responseData,
					meta: { pagination },
				},
			} = await fetchData({
				filters: {
					// name: { $contains: searchValue },
					...generateFiltersByQuery(othersQuery),
				},
				pagination: searchValue ? {} : { page: +page },
				populate: '*',
				sort,
			});
			setData(responseData);
			if (pagination) {
				setPageCount(pagination.pageCount);
				if (pagination.pageCount < +page) {
					router.query.page = (pagination.pageCount || 1).toString();
					router.push({
						pathname: router.pathname,
						query: router.query,
					});
				}
				setTotal(pagination.total);
			}
			setIsFirstDataLoaded(true);
		} catch (err) {
			store.notification.showMessage({
				content: (
					<Alert severity='error' variant='filled'>
						Произошла какая-то ошибка, обратитесь в поддержку
					</Alert>
				),
			});
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
		<>
			<WhiteBox>
				<Typography
					textTransform='capitalize'
					component='h1'
					variant='h4'
					textAlign='center'>
					{title}
				</Typography>
			</WhiteBox>
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
						config={filtersConfig}
						total={total}
						fetchData={throttledFetchProducts}></Filters>
					<Reviews></Reviews>
				</Box>
				<Box
					marginRight='1em'
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
							[styles['content-items_no-data']]: !data.length,
						})}>
						{data.length ? (
							data.map((item) => (
								<ProductItem
									dataFieldsToShow={dataFieldsToShow}
									key={item.id}
									data={item}></ProductItem>
							))
						) : isFirstDataLoaded && !isLoading ? (
							<Typography textAlign='center' variant='h5'>
								Данных не найдено
							</Typography>
						) : (
							<></>
						)}
					</WhiteBox>
					{!!data.length && (
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
				<Box
					component='aside'
					className={classNames(
						styles.sider,
						isTablet && styles.sider_tablet
					)}>
					<News></News>
				</Box>
			</Box>
			<NewProducts title={title}></NewProducts>
		</>
	);
};

export default Catalog;
