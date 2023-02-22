import Catalog from 'components/Catalog';
import { CircularProgress } from '@mui/material';
import { ApiResponse, Filters, SEO } from 'api/types';
import { API_MAX_LIMIT } from 'api/constants';
import { useState, SetStateAction, Dispatch, useEffect, FC } from 'react';
import { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { fetchGenerations } from 'api/generations/generations';
import { KindSparePart } from 'api/kindSpareParts/types';
import { Generation } from 'api/generations/types';
import { Model } from 'api/models/types';
import { Brand } from 'api/brands/types';
import { fetchModels } from 'api/models/models';
import { DefaultPage } from 'api/pages/types';
import { fetchCabins } from 'api/cabins/cabins';
import { useRouter } from 'next/router';

interface Props {
    page: DefaultPage;
    brands: Brand[];
}

const CatalogCabins: FC<Props> = ({ page, brands }) => {
    const [models, setModels] = useState<Model[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [kindSpareParts, setKindSpareParts] = useState<KindSparePart[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    const router = useRouter();
    const [brand, model] = router.query.slug || [];

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

    const handleOpenAutocompleteKindSparePart = () =>
        handleOpenAutocomplete<KindSparePart>(!!kindSpareParts.length, setKindSpareParts, () =>
            fetchKindSpareParts({
                filters: { type: 'cabin' },
                pagination: { limit: API_MAX_LIMIT }
            })
        );

    const handleChangeBrandAutocomplete = () => {
        setModels([]);
        setGenerations([]);
    };

    const handleChangeModelAutocomplete = () => {
        setGenerations([]);
    };

    const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

    const filtersConfig = [
        [
            {
                id: 'brand',
                placeholder: 'Марка',
                type: 'autocomplete',
                onChange: handleChangeBrandAutocomplete,
                options: brands.map((item) => ({ label: item.name, value: item.slug })),
                noOptionsText: noOptionsText
            }
        ],
        [
            {
                id: 'model',
                placeholder: 'Модель',
                type: 'autocomplete',
                disabledDependencyId: 'brand',
                onChange: handleChangeModelAutocomplete,
                options: models.map((item) => ({ label: item.name, value: item.slug })),
                onOpen: handleOpenAutocompleteModel,
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
                onOpen: handleOpenAutocompleteGeneration,
                noOptionsText: noOptionsText
            }
        ],
        [
            {
                id: 'kindSparePart',
                placeholder: 'Запчасть',
                type: 'autocomplete',
                options: kindSpareParts.map((item) => item.name),
                onOpen: handleOpenAutocompleteKindSparePart,
                noOptionsText: noOptionsText
            }
        ]
    ];

    const generateFiltersByQuery = ({
        brand,
        model,
        generation,
        kindSparePart,
        ...others
    }: {
        [key: string]: string;
    }): Filters => {
        let filters: Filters = {
            brand: { slug: brand },
            model: { name: model },
            generation: { name: generation },
            kindSparePart: { name: kindSparePart }
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
            searchPlaceholder="Поиск ..."
            filtersConfig={filtersConfig}
            seo={page.seo}
            fetchData={fetchCabins}
            generateFiltersByQuery={generateFiltersByQuery}></Catalog>
    );
};

export default CatalogCabins;
