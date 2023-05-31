import { Box, CircularProgress } from '@mui/material';
import { Brand } from 'api/brands/types';
import { API_MAX_LIMIT } from 'api/constants';
import { fetchModels } from 'api/models/models';
import { Model } from 'api/models/types';
import { DefaultPage } from 'api/pages/types';
import { ApiResponse, Filters } from 'api/types';
import { WheelDiameterCenterHole } from 'api/wheelDiameterCenterHoles/types';
import { fetchWheelDiameterCenterHoles } from 'api/wheelDiameterCenterHoles/wheelDiameterCenterHoles';
import { WheelDiameter } from 'api/wheelDiameters/types';
import { fetchWheelDiameters } from 'api/wheelDiameters/wheelDiameters';
import { WheelDiskOffset } from 'api/wheelDiskOffsets/types';
import { fetchWheelDiskOffsets } from 'api/wheelDiskOffsets/wheelWidths';
import { WheelNumberHole } from 'api/wheelNumberHoles/types';
import { fetchWheelNumberHoles } from 'api/wheelNumberHoles/wheelNumberHoles';
import { WheelWidth } from 'api/wheelWidths/types';
import { fetchWheelWidths } from 'api/wheelWidths/wheelWidths';
import { fetchWheels } from 'api/wheels/wheels';
import { AxiosResponse } from 'axios';
import Catalog from 'components/Catalog';
import { KIND_WHEELS_SLUGIFY, SLUGIFY_KIND_WHEELS } from 'config';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { getParamByRelation } from 'services/ParamsService';
import { KIND_WHEELS } from '../../constants';
import { usePreviousDifferent } from 'rooks';

interface Props {
    page: DefaultPage;
    brands: Brand[];
}

const CatalogWheels: FC<Props> = ({ page, brands }) => {
    const [models, setModels] = useState<Model[]>([]);
    const [widths, setWidths] = useState<WheelWidth[]>([]);
    const [diskOffsets, setDiskOffsets] = useState<WheelDiskOffset[]>([]);
    const [numberHoles, setNumberHoles] = useState<WheelNumberHole[]>([]);
    const [diameterCenterHoles, setDiameterCenterHoles] = useState<WheelDiameterCenterHole[]>([]);
    const [diameters, setDiameters] = useState<WheelDiameter[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    const router = useRouter();
    const [brand, model] = router.query.slug || [];
    const prevBrand = usePreviousDifferent(brand);

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

    const handleChangeBrandAutocomplete = () => {
        setModels([]);
    };

    const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

    const filtersConfig = [
        [
            {
                id: 'kind',
                placeholder: 'Тип диска',
                type: 'autocomplete',
                options: KIND_WHEELS.map((item) => ({ label: item, value: KIND_WHEELS_SLUGIFY[item] }))
            }
        ],
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
                options: models.map((item) => ({ label: item.name, value: item.slug })),
                onOpen: (values: any) =>
                    handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
                        fetchModels({
                            filters: { brand: { slug: values.brand } },
                            pagination: { limit: API_MAX_LIMIT }
                        })
                    ),
                noOptionsText: noOptionsText
            }
        ],
        [
            {
                id: 'width',
                placeholder: 'J ширина, мм',
                type: 'autocomplete',
                options: widths.map((item) => item.name),
                onOpen: () =>
                    handleOpenAutocomplete<WheelWidth>(!!widths.length, setWidths, () =>
                        fetchWheelWidths({
                            pagination: { limit: API_MAX_LIMIT }
                        })
                    ),
                noOptionsText: noOptionsText
            }
        ],
        [
            {
                id: 'diameter',
                placeholder: 'R диаметр, дюйм',
                type: 'autocomplete',
                options: diameters.map((item) => item.name),
                onOpen: () =>
                    handleOpenAutocomplete<WheelDiameter>(!!diameters.length, setDiameters, () =>
                        fetchWheelDiameters({
                            pagination: { limit: API_MAX_LIMIT }
                        })
                    ),
                noOptionsText: noOptionsText
            }
        ],
        [
            {
                id: 'numberHoles',
                placeholder: 'Количество отверстий',
                type: 'autocomplete',
                options: numberHoles.map((item) => item.name),
                onOpen: (values: any) =>
                    handleOpenAutocomplete<WheelNumberHole>(!!numberHoles.length, setNumberHoles, () =>
                        fetchWheelNumberHoles({
                            pagination: { limit: API_MAX_LIMIT }
                        })
                    ),
                noOptionsText: noOptionsText
            }
        ],
        [
            {
                id: 'diameterCenterHole',
                placeholder: 'DIA диаметр центрального отверстия, мм',
                type: 'autocomplete',
                options: diameterCenterHoles.map((item) => item.name),
                onOpen: () =>
                    handleOpenAutocomplete<WheelDiameterCenterHole>(
                        !!diameterCenterHoles.length,
                        setDiameterCenterHoles,
                        () =>
                            fetchWheelDiameterCenterHoles({
                                pagination: { limit: API_MAX_LIMIT }
                            })
                    ),
                noOptionsText: noOptionsText
            }
        ],
        [
            {
                id: 'diskOffset',
                placeholder: 'PCD расстояние между отверстиями, мм',
                type: 'autocomplete',
                options: diskOffsets.map((item) => item.name),
                onOpen: () =>
                    handleOpenAutocomplete<WheelDiskOffset>(!!diskOffsets.length, setDiskOffsets, () =>
                        fetchWheelDiskOffsets({
                            pagination: { limit: API_MAX_LIMIT }
                        })
                    ),
                noOptionsText: noOptionsText
            }
        ],
        [
            {
                id: 'distanceBetweenCenters',
                placeholder: 'ET вылет, мм',
                type: 'number'
            }
        ]
    ];

    const generateFiltersByQuery = ({
        brand,
        model,
        diskOffset,
        diameterCenterHole,
        numberHoles,
        diameter,
        width,
        kind,
        ...others
    }: {
        [key: string]: string;
    }): Filters => {
        let filters: Filters = {
            brand: getParamByRelation(brand, 'slug'),
            model: getParamByRelation(model),
            diskOffset: getParamByRelation(diskOffset),
            diameterCenterHole: getParamByRelation(diameterCenterHole),
            numberHoles: getParamByRelation(numberHoles),
            diameter: getParamByRelation(diameter),
            width: getParamByRelation(width),
            kind: SLUGIFY_KIND_WHEELS[kind]
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
                    id: 'model',
                    name: 'Модель'
                },
                {
                    id: 'diameter',
                    name: 'R диаметр'
                },
                {
                    id: 'count',
                    name: 'Количество'
                }
            ]}
            searchPlaceholder='Поиск ...'
            filtersConfig={filtersConfig}
            fetchData={fetchWheels}
            generateFiltersByQuery={generateFiltersByQuery}></Catalog>
    );
};

export default CatalogWheels;
