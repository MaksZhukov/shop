import { CircularProgress, Pagination } from '@mui/material';
import { Article } from 'api/articles/types';
import { Autocomis } from 'api/autocomises/types';
import { Brand } from 'api/brands/types';
import { fetchCarsOnParts } from 'api/cars-on-parts/cars-on-parts';
import { CarOnParts } from 'api/cars-on-parts/types';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import { MAX_LIMIT } from 'api/constants';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { fetchModels } from 'api/models/models';
import { Model } from 'api/models/types';
import { DefaultPage } from 'api/pages/types';
import { ServiceStation } from 'api/serviceStations/types';
import { ApiResponse, LinkWithImage } from 'api/types';
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import CarItem from 'components/CarItem';
import Catalog from 'components/Catalog/Catalog';
import { BODY_STYLES, FUELS, TRANSMISSIONS } from 'components/Filters/constants';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import styles from './CatalogCars.module.scss';

interface Props {
	brands: Brand[];
	articles: Article[];
	autocomises: Autocomis[];
	advertising: LinkWithImage[];
	discounts: LinkWithImage[];
	page: DefaultPage;
	deliveryAuto: LinkWithImage;
	serviceStations: ServiceStation[];
	fetchCarsApi: typeof fetchCars | typeof fetchCarsOnParts;
}

const CatalogCars: FC<Props> = ({
	brands,
	articles,
	autocomises,
	fetchCarsApi,
	page,
	advertising,
	deliveryAuto,
	discounts,
	serviceStations,
}) => {
	const [models, setModels] = useState<Model[]>([]);
	const [generations, setGenerations] = useState<Generation[]>([]);
	const [cars, setCars] = useState<(Car | CarOnParts)[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFirstDataLoaded, setIsFirstDataLoaded] = useState<boolean>(false);
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	const { page: qPage = '1', ...restQuery } = router.query as {
		page: string;
	};

	useEffect(() => {
		fetchData(restQuery);
	}, []);

	const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

	const handleOpenAutocomplete =
		<T extends any>(
			hasData: boolean,
			setState: Dispatch<SetStateAction<T[]>>,
			fetchFunc: () => Promise<AxiosResponse<ApiResponse<T[]>>>
		) =>
		async () => {
			if (!hasData) {
				setIsLoading(true);
				try {
					const {
						data: { data },
					} = await fetchFunc();
					setState(data);
				} catch (err) {
					enqueueSnackbar(
						'Произошла какая-то ошибка при загрузке данных для автозаполнения, обратитесь в поддержку',
						{ variant: 'error' }
					);
				}
				setIsLoading(false);
			}
		};

	const filtersConfig = [
		[
			{
				id: 'brand',
				placeholder: 'Марка',
				disabled: false,
				type: 'autocomplete',
				options: brands.map((item) => ({ label: item.name, value: item.slug })),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'model',
				placeholder: 'Модель',
				type: 'autocomplete',
				disabledDependencyId: 'brand',
				options: models.map((item) => item.name),
				onOpen: (values: { [key: string]: string | null }) =>
					handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
						fetchModels({
							filters: { brand: { name: values.brand as string } },
							pagination: { limit: MAX_LIMIT },
						})
					),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'generation',
				placeholder: 'Поколение',
				type: 'autocomplete',
				disabledDependencyId: 'model',
				options: generations.map((item) => item.name),
				onOpen: (values: { [key: string]: string | null }) =>
					handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
						fetchGenerations({
							filters: { model: { name: values.model as string } },
							pagination: { limit: MAX_LIMIT },
						})
					),
				noOptionsText: noOptionsText,
			},
		],
		[
			{
				id: 'volume',
				placeholder: 'Обьем 2.0',
				type: 'number',
				disabled: false,
			},
		],
		[
			{
				id: 'bodyStyle',
				placeholder: 'Кузов',
				type: 'autocomplete',
				disabled: false,
				options: BODY_STYLES,
			},
		],
		[
			{
				id: 'transmission',
				placeholder: 'Коробка',
				type: 'autocomplete',
				disabled: false,
				options: TRANSMISSIONS,
			},
		],
		[
			{
				id: 'fuel',
				placeholder: 'Тип топлива',
				type: 'autocomplete',
				disabled: false,
				options: FUELS,
			},
		],
	];

	const handleChangePage = (_: any, newPage: number) => {
		router.query.page = newPage.toString();
		router.push({ pathname: router.pathname, query: router.query }, undefined, {
			shallow: true,
		});
	};

	const handleClickFind = (values: any) => {
		Object.keys(values).forEach((key) => {
			if (!values[key]) {
				delete router.query[key];
			} else {
				router.query[key] = values[key];
			}
		});
		router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: true });
		fetchData(values);
	};

	const fetchData = async (values: any) => {
		setIsLoading(true);
		try {
			const {
				data: {
					data,
					meta: { pagination },
				},
			} = await fetchCarsApi({
				filters: {
					brand: values.brand ? { slug: values.brand } : undefined,
					model: values.model ? { name: values.model } : undefined,
					generation: values.generation ? { name: values.generation } : undefined,
					transmission: values.transmission || undefined,
					fuel: values.fuel || undefined,
					bodyStyle: values.bodyStyle || undefined,
				},
				pagination: { page: +qPage },
				populate: ['images', 'model', 'brand'],
			});
			setCars(data);
			if (pagination) {
				setPageCount(pagination.pageCount);
				if (pagination.pageCount < +qPage) {
					router.query.page = (pagination.pageCount || 1).toString();
					router.push(
						{
							pathname: router.pathname,
							query: router.query,
						},
						undefined,
						{ shallow: true }
					);
				}
			}
		} catch (err) {
			enqueueSnackbar('Произошла какая-то ошибка с загрузкой автомобилей, обратитесь в поддержку', {
				variant: 'error',
			});
		}
		setIsFirstDataLoaded(true);
		setIsLoading(false);
	};

	return (
		<Catalog
			filtersConfig={filtersConfig}
			articles={articles}
			autocomises={autocomises}
			seo={page.seo}
			advertising={advertising}
			deliveryAuto={deliveryAuto}
			discounts={discounts}
			serviceStations={serviceStations}
			onClickFind={handleClickFind}
			middleContent={
				<WhiteBox
					className={classNames({
						[styles['loading']]: isLoading,
						[styles['content-items_no-data']]: !cars.length,
					})}
				>
					{cars.length ? (
						cars.map((item) => <CarItem key={item.id} data={item}></CarItem>)
					) : isFirstDataLoaded && !isLoading ? (
						<Typography textAlign='center' variant='h5'>
							Данных не найдено
						</Typography>
					) : (
						<></>
					)}
					{pageCount > 1 && (
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
				</WhiteBox>
			}
		></Catalog>
	);
};

export default CatalogCars;
