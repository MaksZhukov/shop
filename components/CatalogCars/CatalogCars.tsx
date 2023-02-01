import { CircularProgress, Pagination, PaginationItem } from '@mui/material';
import { Article } from 'api/articles/types';
import { Autocomis } from 'api/autocomises/types';
import { Brand } from 'api/brands/types';
import { fetchCarsOnParts } from 'api/cars-on-parts/cars-on-parts';
import { CarOnParts } from 'api/cars-on-parts/types';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import { API_MAX_LIMIT } from 'api/constants';
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
import { BODY_STYLES, FUELS, TRANSMISSIONS } from '../../constants';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Dispatch, FC, SetStateAction, UIEventHandler, useEffect, useState } from 'react';
import styles from './CatalogCars.module.scss';
import { fetchEngineVolumes } from 'api/engineVolumes/wheelWidths';
import { EngineVolume } from 'api/engineVolumes/types';
import { getParamByRelation } from 'services/ParamsService';
import NextLink from 'next/link';

interface Props {
    brands: Brand[];
    articles: Article[];
    autocomises: Autocomis[];
    advertising: LinkWithImage[];
    discounts: LinkWithImage[];
    page: DefaultPage;
    deliveryAuto: LinkWithImage;
    serviceStations: ServiceStation[];
    onScrollBrandsList: UIEventHandler<HTMLUListElement>;
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
    onScrollBrandsList
}) => {
    const [models, setModels] = useState<Model[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [cars, setCars] = useState<(Car | CarOnParts)[]>([]);
    const [volumes, setVolumes] = useState<EngineVolume[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAutocompleteLoading, setIsAutocompleteLoading] = useState<boolean>(false);
    const [isFirstDataLoaded, setIsFirstDataLoaded] = useState<boolean>(false);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const { page: qPage = '1', ...restQuery } = router.query as {
        page: string;
    };

    useEffect(() => {
        fetchData(restQuery);
    }, [qPage]);

    const noOptionsText = isAutocompleteLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

    const handleOpenAutocomplete =
        <T extends any>(
            hasData: boolean,
            setState: Dispatch<SetStateAction<T[]>>,
            fetchFunc: () => Promise<AxiosResponse<ApiResponse<T[]>>>
        ) =>
        async () => {
            if (!hasData) {
                setIsAutocompleteLoading(true);
                try {
                    const {
                        data: { data }
                    } = await fetchFunc();
                    setState(data);
                } catch (err) {
                    enqueueSnackbar(
                        'Произошла какая-то ошибка при загрузке данных для автозаполнения, обратитесь в поддержку',
                        { variant: 'error' }
                    );
                }
                setIsAutocompleteLoading(false);
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
                onScroll: onScrollBrandsList,
                noOptionsText: noOptionsText
            }
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
                            filters: { brand: { slug: values.brand as string } },
                            pagination: { limit: API_MAX_LIMIT }
                        })
                    ),
                noOptionsText: noOptionsText
            }
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
                            pagination: { limit: API_MAX_LIMIT }
                        })
                    ),
                noOptionsText: noOptionsText
            }
        ],
        [
            {
                id: 'volume',
                placeholder: 'Обьем 2.0',
                type: 'autocomplete',
                options: volumes.map((item) => item.name),
                onOpen: () =>
                    handleOpenAutocomplete<EngineVolume>(!!volumes.length, setVolumes, () =>
                        fetchEngineVolumes({
                            pagination: { limit: API_MAX_LIMIT }
                        })
                    )
            }
        ],
        [
            {
                id: 'bodyStyle',
                placeholder: 'Кузов',
                type: 'autocomplete',
                disabled: false,
                options: BODY_STYLES
            }
        ],
        [
            {
                id: 'transmission',
                placeholder: 'Коробка',
                type: 'autocomplete',
                disabled: false,
                options: TRANSMISSIONS
            }
        ],
        [
            {
                id: 'fuel',
                placeholder: 'Тип топлива',
                type: 'autocomplete',
                disabled: false,
                options: FUELS
            }
        ]
    ];

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
                    meta: { pagination }
                }
            } = await fetchCarsApi({
                filters: {
                    brand: getParamByRelation(values.brand, 'slug'),
                    model: getParamByRelation(values.Model),
                    generation: getParamByRelation(values.generation),
                    volume: getParamByRelation(values.volume),
                    transmission: values.transmission,
                    fuel: values.fuel,
                    bodyStyle: values.bodyStyle
                },
                pagination: { page: +qPage },
                populate: ['images', 'model', 'brand']
            });
            setCars(data);
            if (pagination) {
                setPageCount(pagination.pageCount);
                if (pagination.pageCount < +qPage) {
                    router.query.page = (pagination.pageCount || 1).toString();
                    router.push(
                        {
                            pathname: router.pathname,
                            query: router.query
                        },
                        undefined,
                        { shallow: true }
                    );
                }
            }
        } catch (err) {
            enqueueSnackbar('Произошла какая-то ошибка с загрузкой автомобилей, обратитесь в поддержку', {
                variant: 'error'
            });
        }
        setIsFirstDataLoaded(true);
        setIsLoading(false);
    };

    return (
        <WhiteBox
            className={classNames({
                [styles['loading']]: isLoading,
                [styles['content-items_no-data']]: !cars.length
            })}>
            {cars.length ? (
                cars.map((item) => <CarItem key={item.id} data={item}></CarItem>)
            ) : isFirstDataLoaded && !isLoading ? (
                <Typography textAlign="center" variant="h5">
                    Данных не найдено
                </Typography>
            ) : (
                <></>
            )}
            {pageCount > 1 && (
                <WhiteBox display="flex" justifyContent="center">
                    <Pagination
                        renderItem={(params) => (
                            <NextLink shallow href={`${router.pathname}?page=${params.page}`}>
                                <PaginationItem {...params}>{params.page}</PaginationItem>
                            </NextLink>
                        )}
                        page={+qPage}
                        siblingCount={2}
                        color="primary"
                        count={pageCount}
                        variant="outlined"
                    />
                </WhiteBox>
            )}
        </WhiteBox>
    );
};

export default CatalogCars;
