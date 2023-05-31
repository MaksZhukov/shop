import { CircularProgress } from '@mui/material';
import { Brand } from 'api/brands/types';
import { API_DEFAULT_LIMIT, API_MAX_LIMIT } from 'api/constants';
import { EngineVolume } from 'api/engineVolumes/types';
import { fetchEngineVolumes } from 'api/engineVolumes/wheelWidths';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePart } from 'api/kindSpareParts/types';
import { fetchModels } from 'api/models/models';
import { Model } from 'api/models/types';
import { DefaultPage } from 'api/pages/types';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { ApiResponse, Filters } from 'api/types';
import { AxiosResponse } from 'axios';
import Catalog from 'components/Catalog';
import { getSparePartsFiltersConfig } from 'components/Filters/config';
import { SLUGIFY_BODY_STYLES, SLUGIFY_FUELS, SLUGIFY_TRANSMISSIONS } from 'config';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Dispatch, FC, SetStateAction, UIEventHandler, useEffect, useRef, useState } from 'react';
import { useDebounce, usePreviousDifferent, useThrottle } from 'rooks';
import { getParamByRelation } from 'services/ParamsService';
import { OFFSET_SCROLL_LOAD_MORE } from '../../constants';

interface Props {
    page: DefaultPage;
    brands: Brand[];
    kindSparePart?: KindSparePart;
}

const CatalogSpareParts: FC<Props> = ({ page, brands, kindSparePart }) => {
    const [models, setModels] = useState<Model[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({
        data: kindSparePart ? [kindSparePart] : [],
        meta: {}
    });
    const [volumes, setVolumes] = useState<EngineVolume[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const router = useRouter();
    const [brand, model] = router.query.slug || [];
    const prevBrand = usePreviousDifferent(brand);

    useEffect(() => {
        if (router.query.kindSparePart) {
            loadKindSpareParts();
        }
    }, [router.query.kindSparePart]);

    useEffect(() => {
        if (router.query.generation) {
            handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
                fetchGenerations({
                    filters: { model: { slug: model.replace('model-', '') as string }, brand: { slug: brand } },
                    pagination: { limit: API_MAX_LIMIT }
                })
            )();
        }
    }, [router.query.generation]);

    const loadKindSpareParts = async () => {
        const { data } = await fetchKindSpareParts({
            filters: { type: 'regular' },
            pagination: { start: kindSpareParts.data.length }
        });
        setKindSpareParts({
            data: [
                ...kindSpareParts.data,
                ...(kindSparePart ? data.data.filter((item) => item.id !== kindSparePart.id) : data.data)
            ],
            meta: data.meta
        });
    };

    const [throttledLoadMoreKindSpareParts] = useThrottle(async () => {
        setIsLoadingMore(true);
        await loadKindSpareParts();
        setIsLoadingMore(false);
    });
    useEffect(() => {
        if (brand !== prevBrand && !model) {
            setModels([]);
        }
    }, [brand]);

    useEffect(() => {
        if (!models.length && model) {
            handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
                fetchModels({
                    filters: { brand: { slug: brand } },
                    pagination: { limit: API_MAX_LIMIT }
                })
            )();
        }
    }, [model]);

    const fetchKindSparePartsRef = useRef(async (value: string) => {
        setIsLoading(true);
        const { data } = await fetchKindSpareParts({ filters: { type: 'regular', name: { $contains: value } } });
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
                pagination: { limit: API_MAX_LIMIT }
            })
        );

    const handleOpenAutocompleteGeneration = (values: { [key: string]: string | null }) =>
        handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
            fetchGenerations({
                filters: { model: { slug: values.model as string }, brand: { slug: values.brand } },
                pagination: { limit: API_MAX_LIMIT }
            })
        );

    const handleOpenAutocompleteKindSparePart = () => async () => {
        if (
            kindSpareParts.data.length < API_DEFAULT_LIMIT &&
            kindSpareParts.meta.pagination?.total !== kindSpareParts.data.length
        ) {
            setIsLoading(true);
            await loadKindSpareParts();
            setIsLoading(false);
        }
    };

    const handleOpenAutocompleteVolume = () =>
        handleOpenAutocomplete<EngineVolume>(!!volumes.length, setVolumes, () =>
            fetchEngineVolumes({
                pagination: { limit: API_MAX_LIMIT }
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

    const handleChangeBrandAutocomplete = () => {
        setModels([]);
        setGenerations([]);
    };

    const handleChangeModelAutocomplete = () => {
        setGenerations([]);
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
        onChangeBrandAutocomplete: handleChangeBrandAutocomplete,
        onChangeModelAutocomplete: handleChangeModelAutocomplete,
        onScrollKindSparePartAutocomplete: handleScrollKindSparePartAutocomplete,
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
        fuel,
        bodyStyle,
        transmission,
        ...others
    }: {
        [key: string]: string;
    }): Filters => {
        let filters: Filters = {
            brand: getParamByRelation(brand, 'slug'),
            model: getParamByRelation(model, 'slug'),
            generation: getParamByRelation(generation, 'slug'),
            kindSparePart: getParamByRelation(kindSparePart, 'slug'),
            volume: getParamByRelation(volume),
            fuel: SLUGIFY_FUELS[fuel],
            bodyStyle: SLUGIFY_BODY_STYLES[bodyStyle],
            transmission: SLUGIFY_TRANSMISSIONS[transmission]
        };
        return { ...filters, ...others };
    };

    return (
        <Catalog
            brands={brands}
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
            searchPlaceholder='Поиск ...'
            filtersConfig={filtersConfig}
            seo={page?.seo}
            fetchData={fetchSpareParts}
            generateFiltersByQuery={generateFiltersByQuery}></Catalog>
    );
};

export default CatalogSpareParts;
