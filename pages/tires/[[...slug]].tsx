import type { NextPage } from 'next';
import Catalog from 'components/Catalog';
import { CircularProgress } from '@mui/material';
import { SEASONS } from '../../constants';
import { ApiResponse, Filters, SEO } from 'api/types';
import { API_MAX_LIMIT } from 'api/constants';
import { useState, SetStateAction, Dispatch } from 'react';
import { AxiosResponse } from 'axios';
import { fetchTires } from 'api/tires/tires';
import { useSnackbar } from 'notistack';
import { fetchTireBrandBySlug, fetchTireBrands } from 'api/tireBrands/tireBrands';
import { getPageProps } from 'services/PagePropsService';
import { TireBrand } from 'api/tireBrands/types';
import { fetchCars } from 'api/cars/cars';
import { fetchArticles } from 'api/articles/articles';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageMain } from 'api/pages/types';
import { TireWidth } from 'api/tireWidths/types';
import { TireHeight } from 'api/tireHeights/types';
import { TireDiameter } from 'api/tireDiameters/types';
import { fetchTireHeights } from 'api/tireHeights/tireHeights';
import { fetchTireWidths } from 'api/tireWidths/tireWidths';
import { fetchTireDiameters } from 'api/tireDiameters/tireDiameters';

interface Props {
    page: DefaultPage;
    tireBrands: TireBrand[];
}

const Tires: NextPage<Props> = ({ page, tireBrands }) => {
    const [brands, setBrands] = useState<TireBrand[]>(tireBrands);
    const [widths, setWidths] = useState<TireWidth[]>([]);
    const [heights, setHeights] = useState<TireHeight[]>([]);
    const [diameters, setDiameters] = useState<TireDiameter[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

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

    const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

    const filtersConfig = [
        [
            {
                id: 'brand',
                placeholder: 'Марка',
                type: 'autocomplete',
                options: brands.map((item) => ({ label: item.name, value: item.slug })),
                onOpen: () =>
                    handleOpenAutocomplete<TireBrand>(
                        !!brands.length,
                        setBrands,

                        () =>
                            fetchTireBrands({
                                pagination: { limit: API_MAX_LIMIT }
                            })
                    ),
                noOptionsText: noOptionsText
            }
        ],
        [
            {
                id: 'width',
                placeholder: 'Ширина',
                type: 'autocomplete',
                options: widths.map((item) => item.name),
                onOpen: () =>
                    handleOpenAutocomplete<TireWidth>(
                        !!widths.length,
                        setWidths,

                        () =>
                            fetchTireWidths({
                                pagination: { limit: API_MAX_LIMIT }
                            })
                    ),
                noOptionsText: noOptionsText
            }
        ],
        [
            {
                id: 'height',
                placeholder: 'Высота',
                type: 'autocomplete',
                options: heights.map((item) => item.name),
                onOpen: () =>
                    handleOpenAutocomplete<TireHeight>(
                        !!heights.length,
                        setHeights,

                        () =>
                            fetchTireHeights({
                                pagination: { limit: API_MAX_LIMIT }
                            })
                    ),
                noOptionsText: noOptionsText
            }
        ],
        [
            {
                id: 'diameter',
                placeholder: 'Диаметр',
                type: 'autocomplete',
                options: diameters.map((item) => item.name),
                onOpen: () =>
                    handleOpenAutocomplete<TireDiameter>(
                        !!diameters.length,
                        setDiameters,

                        () =>
                            fetchTireDiameters({
                                pagination: { limit: API_MAX_LIMIT }
                            })
                    ),
                noOptionsText: noOptionsText
            }
        ],
        [
            {
                id: 'season',
                placeholder: 'Сезон',
                type: 'autocomplete',
                options: SEASONS,
                noOptionsText: ''
            }
        ]
    ];

    const generateFiltersByQuery = ({
        brand,
        diameter,
        height,
        width,
        ...others
    }: {
        [key: string]: string;
    }): Filters => {
        let filters: Filters = {
            brand: brand ? { slug: brand } : undefined,
            width: width ? { name: width } : undefined,
            height: height ? { name: height } : undefined,
            diameter: diameter ? { name: diameter } : undefined
        };
        return { ...filters, ...others };
    };

    return (
        <Catalog
            seo={page.seo}
            dataFieldsToShow={[
                {
                    id: 'brand',
                    name: 'Марка'
                },
                {
                    id: 'diameter',
                    name: 'Диаметр'
                },
                {
                    id: 'width',
                    name: 'Ширина'
                },
                {
                    id: 'count',
                    name: 'Количество'
                }
            ]}
            searchPlaceholder="Поиск шин ..."
            filtersConfig={filtersConfig}
            fetchData={fetchTires}
            generateFiltersByQuery={generateFiltersByQuery}></Catalog>
    );
};

export default Tires;

export const getServerSideProps = getPageProps(undefined, async (context) => {
    const { slug } = context.query;

    let tireBrands: TireBrand[] = [];
    const brandParam = slug ? slug[0] : undefined;
    let seo: SEO | null = null;
    if (brandParam) {
        const [
            {
                data: { data }
            },
            {
                data: { data: tireBrandsData }
            }
        ] = await Promise.all([
            fetchTireBrandBySlug(brandParam, { populate: ['seo.images', 'image'] }),
            fetchTireBrands({
                pagination: { limit: API_MAX_LIMIT }
            })
        ]);
        seo = data.seo;
        tireBrands = tireBrandsData;
    } else {
        const {
            data: { data }
        } = await fetchPage('tire')();
        seo = data.seo;
    }
    return {
        page: { seo },
        tireBrands
    };
});
