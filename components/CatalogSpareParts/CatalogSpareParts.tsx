import { Dispatch, FC, SetStateAction, UIEventHandler, useEffect, useRef, useState } from 'react';
import { Brand } from 'api/brands/types';
import { ApiResponse, Filters } from 'api/types';
import { fetchModels } from 'api/models/models';
import { DefaultPage } from 'api/pages/types';
import Catalog from 'components/Catalog';
import { getParamByRelation } from 'services/ParamsService';
import { getSparePartsFiltersConfig } from 'components/Filters/config';
import { CircularProgress } from '@mui/material';
import { OFFSET_SCROLL_LOAD_MORE } from '../../constants';
import { EngineVolume } from 'api/engineVolumes/types';
import { fetchEngineVolumes } from 'api/engineVolumes/wheelWidths';
import { fetchGenerations } from 'api/generations/generations';
import { Model } from 'api/models/types';
import { AxiosResponse } from 'axios';
import { useDebounce, useThrottle } from 'rooks';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { useSnackbar } from 'notistack';
import { KindSparePart } from 'api/kindSpareParts/types';
import { Generation } from 'api/generations/types';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { useRouter } from 'next/router';
import { API_MAX_LIMIT } from 'api/constants';

interface Props {
    page: DefaultPage;
    brands: Brand[];
}

const CatalogSpareParts: FC<Props> = ({ page, brands }) => {
    const [models, setModels] = useState<Model[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({ data: [], meta: {} });
    const [volumes, setVolumes] = useState<EngineVolume[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const router = useRouter();
    const [brand, model] = router.query.slug || [];

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
                pagination: { limit: API_MAX_LIMIT }
            })
        );

    const handleOpenAutocompleteGeneration = (values: { [key: string]: string | null }) =>
        handleOpenAutocomplete<Generation>(!!generations.length, setGenerations, () =>
            fetchGenerations({
                filters: { model: { slug: values.slug as string } },
                pagination: { limit: API_MAX_LIMIT }
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
            model: getParamByRelation(model, 'slug'),
            generation: getParamByRelation(generation),
            kindSparePart: getParamByRelation(kindSparePart),
            volume: getParamByRelation(volume)
        };
        return { ...filters, ...others };
    };

    return (
        <Catalog
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

export default CatalogSpareParts;
