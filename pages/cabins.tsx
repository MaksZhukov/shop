import type { NextPage } from 'next';
import Catalog from 'components/Catalog';
import { CircularProgress, Container } from '@mui/material';
import { SEASONS } from 'components/Filters/constants';
import { ApiResponse, Filters, LinkWithImage } from 'api/types';
import { MAX_LIMIT } from 'api/constants';
import { useState, SetStateAction, Dispatch } from 'react';
import { AxiosResponse } from 'axios';
import { fetchTires } from 'api/tires/tires';
import { useSnackbar } from 'notistack';
import { fetchTireBrands } from 'api/tireBrands/tireBrands';
import { getPageProps } from 'services/PagePropsService';
import { fetchPageTires } from 'api/pageTires/pageTires';
import { PageTires } from 'api/pageTires/types';
import { TireBrand } from 'api/tireBrands/types';
import { fetchCars } from 'api/cars/cars';
import { fetchPageMain } from 'api/pageMain/pageMain';
import { Car } from 'api/cars/types';
import { fetchAutocomises } from 'api/autocomises/autocomises';
import { fetchServiceStations } from 'api/serviceStations/serviceStations';
import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { fetchPage } from 'api/pages';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { getSparePartsFiltersConfig } from 'components/Filters/config';
import { fetchGenerations } from 'api/generations/generations';
import { KindSparePart } from 'api/kindSpareParts/types';
import { Generation } from 'api/generations/types';
import { Model } from 'api/models/types';
import { Brand } from 'api/brands/types';
import { useRouter } from 'next/router';
import { fetchModels } from 'api/models/models';
import { DefaultPage } from 'api/pages/types';
import { fetchCabins } from 'api/cabins/cabins';

interface Props {
    page: DefaultPage;
    cars: Car[];
    brands: Brand[];
    articles: Article[];
    advertising: LinkWithImage[];
    autocomises: Autocomis[];
    deliveryAuto: LinkWithImage;
    discounts: LinkWithImage[];
    serviceStations: ServiceStation[];
}

const Tires: NextPage<Props> = ({
    page,
    advertising,
    autocomises,
    deliveryAuto,
    discounts,
    serviceStations,
    cars,
    brands,
    articles,
}) => {
    const [models, setModels] = useState<Model[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [kindSpareParts, setKindSpareParts] = useState<KindSparePart[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const { brandId = '', modelId = '' } = router.query as {
        brandId: string;
        modelId: string;
    };
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

    const handleChangeBrandAutocomplete = (_: any, selected: Brand | null) => {
        if (selected) {
            router.query.brandName = selected.name.toString();
            router.query.brandId = selected.id.toString();
        } else {
            delete router.query.brandName;
            delete router.query.brandId;
            delete router.query.modelName;
            delete router.query.modelId;
            delete router.query.generationId;
            delete router.query.generationName;
        }
        router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: true });
        setModels([]);
    };

    const handleOpenAutocompleteModel = handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
        fetchModels({
            filters: { brand: brandId as string },
            pagination: { limit: MAX_LIMIT },
        })
    );

    const handleOpenAutocompleteGeneration = handleOpenAutocomplete<Generation>(
        !!generations.length,
        setGenerations,
        () =>
            fetchGenerations({
                filters: { model: modelId as string },
                pagination: { limit: MAX_LIMIT },
            })
    );

    const handleOpenAutocompleteKindSparePart = handleOpenAutocomplete<KindSparePart>(
        !!kindSpareParts.length,
        setKindSpareParts,
        () =>
            fetchKindSpareParts({
                filters: { type: 'cabin' },
                pagination: { limit: MAX_LIMIT },
            })
    );

    const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

    const filtersConfig = [
        [
            {
                id: 'brandId',
                name: 'brandName',
                placeholder: 'Марка',
                disabled: false,
                type: 'autocomplete',
                options: brands.map((item) => ({ label: item.name, ...item })),
                onChange: handleChangeBrandAutocomplete,
                noOptionsText: noOptionsText,
            },
        ],
        [
            {
                id: 'modelId',
                name: 'modelName',
                placeholder: 'Модель',
                type: 'autocomplete',
                disabled: !brandId,
                options: models.map((item) => ({ label: item.name, ...item })),
                onOpen: handleOpenAutocompleteModel,
                noOptionsText: noOptionsText,
            },
        ],
        [
            {
                id: 'generationId',
                name: 'generationName',
                placeholder: 'Поколение',
                type: 'autocomplete',
                disabled: !modelId,
                options: generations.map((item) => ({
                    label: item.name,
                    ...item,
                })),
                onOpen: handleOpenAutocompleteGeneration,
                noOptionsText: noOptionsText,
            },
        ],
        [
            {
                id: 'kindSparePartId',
                name: 'kindSparePartName',
                placeholder: 'Запчасть',
                type: 'autocomplete',
                disabled: false,
                options: kindSpareParts.map((item) => ({
                    label: item.name,
                    ...item,
                })),
                onOpen: handleOpenAutocompleteKindSparePart,
                noOptionsText: noOptionsText,
            },
        ],
    ];

    const generateFiltersByQuery = ({
        min,
        max,
        brandId,
        modelId,
        generationId,
        kindSparePartId,
        kindSparePartName,
        brandName,
        modelName,
        generationName,
        ...others
    }: {
        [key: string]: string;
    }): Filters => {
        let filters: Filters = {
            brand: brandId || undefined,
            model: modelId || undefined,
            generation: generationId || undefined,
            kindSparePart: kindSparePartId || undefined,
        };
        return { ...filters, ...others };
    };

    return (
        <Catalog
            newProductsTitle="Запчасти"
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
                    name: 'Марка',
                },
                {
                    id: 'model',
                    name: 'Модель',
                },
                {
                    id: 'kindSparePart',
                    name: 'Запчасть',
                },
            ]}
            searchPlaceholder="Поиск детали ..."
            filtersConfig={filtersConfig}
            seo={page.seo}
            fetchData={fetchCabins}
            generateFiltersByQuery={generateFiltersByQuery}
        ></Catalog>
    );
};

export default Tires;

export const getServerSideProps = getPageProps(
    fetchPage('cabin'),
    async () => ({
        autocomises: (await fetchAutocomises({ populate: 'image' }, true)).data.data,
    }),
    async () => ({
        serviceStations: (await fetchServiceStations({ populate: 'image' }, true)).data.data,
    }),
    async () => {
        const {
            data: {
                data: { advertising, deliveryAuto, discounts },
            },
        } = await fetchPageMain();
        return {
            advertising,
            deliveryAuto,
            discounts,
        };
    },
    async () => {
        const { data } = await fetchCars({ populate: ['images'], pagination: { limit: 10 } }, true);
        return { cars: data.data };
    },
    async () => ({
        articles: (await fetchArticles({ populate: 'image' }, true)).data.data,
    })
);
