import type { NextPage } from 'next';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import Catalog from 'components/Catalog';
import { CircularProgress } from '@mui/material';
import { Dispatch, SetStateAction, UIEventHandler, useRef, useState } from 'react';
import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { KindSparePart } from 'api/kindSpareParts/types';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import { ApiResponse, Filters, LinkWithImage, SEO } from 'api/types';
import { MAX_LIMIT } from 'api/constants';
import { fetchModels } from 'api/models/models';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { useSnackbar } from 'notistack';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { getPageProps } from 'services/PagePropsService';
import { getSparePartsFiltersConfig } from 'components/Filters/config';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { useDebounce, useThrottle } from 'rooks';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageMain } from 'api/pages/types';
import { fetchBrandBySlug, fetchBrands } from 'api/brands/brands';
import { EngineVolume } from 'api/engineVolumes/types';
import { fetchEngineVolumes } from 'api/engineVolumes/wheelWidths';
import { getParamByRelation } from 'services/ParamsService';
import { OFFSET_SCROLL_LOAD_MORE } from '../../constants';

interface Props {
    page: DefaultPage;
    brands: Brand[];
    cars: Car[];
    articles: Article[];
    advertising: LinkWithImage[];
    autocomises: Autocomis[];
    deliveryAuto: LinkWithImage;
    discounts: LinkWithImage[];
    serviceStations: ServiceStation[];
    onScrollBrandsList: UIEventHandler<HTMLUListElement>;
}

const SpareParts: NextPage<Props> = ({
    page,
    advertising,
    autocomises,
    deliveryAuto,
    discounts,
    serviceStations,
    cars,
    brands,
    articles,
    onScrollBrandsList
}) => {
    const [models, setModels] = useState<Model[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({ data: [], meta: {} });
    const [volumes, setVolumes] = useState<EngineVolume[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const loadKindSpareParts = async () => {
        const { data } = await fetchKindSpareParts({
            pagination: { start: kindSpareParts.data.length }
        });
        setKindSpareParts({ data: [...kindSpareParts.data, ...data.data], meta: data.meta });
    };

    const [throttledLoadMoreKindSpareParts] = useThrottle(async () => {
        setIsLoadingMore(true);
        await loadKindSpareParts();
        setIsLoadingMore(false);
    });

    const fetchKindSparePartsRef = useRef(async (value: string) => {
        setIsLoading(true);
        const { data } = await fetchKindSpareParts({ filters: { name: { $contains: value } } });
        setKindSpareParts(data);
        setIsLoading(false);
    });

    const debouncedFetchKindSparePartsRef = useDebounce(fetchKindSparePartsRef.current, 300);

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
                        data: { data }
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

    const handleOpenAutocompleteModel = (values: any) =>
        handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
            fetchModels({
                filters: { brand: { slug: values.brand } },
                pagination: { limit: MAX_LIMIT }
            })
        );

    const handleOpenAutocompleteGeneration = (values: { [key: string]: string | null }) =>
        handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
            fetchGenerations({
                filters: { model: { name: values.model as string } },
                pagination: { limit: MAX_LIMIT }
            })
        );

    const handleOpenAutocompleteKindSparePart = () => async () => {
        if (!kindSpareParts.data.length) {
            setIsLoading(true);
            await loadKindSpareParts();
            setIsLoading(false);
        }
    };

    const handleOpenAutocompleteVolume = () =>
        handleOpenAutocomplete<EngineVolume>(!!volumes.length, setVolumes, () =>
            fetchEngineVolumes({
                pagination: { limit: MAX_LIMIT }
            })
        );

    const handleInputChangeKindSparePart = (_: any, value: string) => {
        debouncedFetchKindSparePartsRef(value);
    };

    const handleScrollKindSparePartAutocomplete: UIEventHandler<HTMLUListElement> = (event) => {
        if (
            event.currentTarget.scrollTop + event.currentTarget.offsetHeight + OFFSET_SCROLL_LOAD_MORE >=
            event.currentTarget.scrollHeight
        ) {
            throttledLoadMoreKindSpareParts();
        }
    };

    const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

    const filtersConfig = getSparePartsFiltersConfig({
        brands,
        models,
        kindSpareParts: kindSpareParts.data,
        generations,
        noOptionsText,
        volumes,
        isLoadingMoreKindSpareParts: isLoadingMore,
        onScrollKindSparePartAutocomplete: handleScrollKindSparePartAutocomplete,
        onScrollBrandAutocomplete: onScrollBrandsList,
        onOpenAutocompleteModel: handleOpenAutocompleteModel,
        onOpenAutocompleteGeneration: handleOpenAutocompleteGeneration,
        onOpenAutoCompleteKindSparePart: handleOpenAutocompleteKindSparePart,
        onInputChangeKindSparePart: handleInputChangeKindSparePart,
        onOpenAutoCompleteVolume: handleOpenAutocompleteVolume
    });

    const generateFiltersByQuery = ({
        brand,
        model,
        generation,
        kindSparePart,
        brandName,
        modelName,
        generationName,
        volume,
        ...others
    }: {
        [key: string]: string;
    }): Filters => {
        let filters: Filters = {
            brand: getParamByRelation(brand, 'slug'),
            model: getParamByRelation(model),
            generation: getParamByRelation(generation),
            kindSparePart: getParamByRelation(kindSparePart),
            volume: getParamByRelation(volume)
        };
        return { ...filters, ...others };
    };

    return (
        <Catalog
            newProductsTitle="Запчастей"
            advertising={advertising}
            autocomises={autocomises}
            deliveryAuto={deliveryAuto}
            discounts={discounts}
            serviceStations={serviceStations}
            cars={cars}
            articles={articles}
            dataFieldsToShow={[
                {
                    id: 'brand',
                    name: 'Марка'
                },
                {
                    id: 'model',
                    name: 'Модель'
                },
                {
                    id: 'kindSparePart',
                    name: 'Запчасть'
                }
            ]}
            searchPlaceholder="Поиск детали ..."
            filtersConfig={filtersConfig}
            seo={page?.seo}
            fetchData={fetchSpareParts}
            generateFiltersByQuery={generateFiltersByQuery}></Catalog>
    );
};

export default SpareParts;

export const getServerSideProps = getPageProps(
    undefined,
    async (context) => {
        const { brand } = context.query;
        const brandParam = brand ? brand[0] : undefined;
        let seo: SEO | null = null;
        if (brandParam) {
            const {
                data: { data }
            } = await fetchBrandBySlug(brand, {
                populate: ['seoSpareParts.images', 'image']
            });
            seo = data.seoSpareParts;
        } else {
            const {
                data: { data }
            } = await fetchPage('spare-part')();
            seo = data.seo;
        }
        return {
            page: { seo }
        };
    },
    async () => {
        const {
            data: {
                data: { advertising, deliveryAuto, discounts, autocomises, serviceStations }
            }
        } = await fetchPage<PageMain>('main')();
        return {
            advertising,
            deliveryAuto,
            discounts,
            autocomises,
            serviceStations
        };
    },
    async () => {
        const { data } = await fetchCars({ populate: ['images'], pagination: { limit: 10 } });
        return { cars: data.data };
    },
    async () => ({
        articles: (await fetchArticles({ populate: 'image' })).data.data
    }),
    async () => ({
        brands: (
            await fetchBrands({
                populate: ['image', 'seo.image']
            })
        ).data.data
    })
);
