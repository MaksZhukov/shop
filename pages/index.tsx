import TuneIcon from '@mui/icons-material/Tune';
import {
    Box,
    Button,
    CircularProgress,
    Input,
    Link,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    useMediaQuery
} from '@mui/material';
import { Container } from '@mui/system';
import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { Brand } from 'api/brands/types';
import { API_MAX_LIMIT } from 'api/constants';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePart } from 'api/kindSpareParts/types';
import { fetchModels } from 'api/models/models';
import { Model } from 'api/models/types';
import { fetchPage } from 'api/pages';
import { PageMain } from 'api/pages/types';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import { fetchTireBrands } from 'api/tireBrands/tireBrands';
import { TireBrand } from 'api/tireBrands/types';
import { fetchTireDiameters } from 'api/tireDiameters/tireDiameters';
import { TireDiameter } from 'api/tireDiameters/types';
import { fetchTireHeights } from 'api/tireHeights/tireHeights';
import { TireHeight } from 'api/tireHeights/types';
import { fetchTireWidths } from 'api/tireWidths/tireWidths';
import { TireWidth } from 'api/tireWidths/types';
import { ApiResponse, ProductType } from 'api/types';
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
import { AxiosResponse } from 'axios';
import classNames from 'classnames';
import Autocomplete from 'components/Autocomplete';
import CarouselReviews from 'components/CarouselReviews';
import Image from 'components/Image';
import LinkWithImage from 'components/LinkWithImage';
import ReactMarkdown from 'components/ReactMarkdown';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import qs from 'qs';

import {
    ChangeEvent,
    Dispatch,
    KeyboardEvent,
    ReactNode,
    SetStateAction,
    UIEventHandler,
    useRef,
    useState
} from 'react';
import Slider from 'react-slick';
import { useDebounce, useThrottle } from 'rooks';
import { getPageProps } from 'services/PagePropsService';
import { BODY_STYLES, FUELS, KIND_WHEELS, OFFSET_SCROLL_LOAD_MORE, SEASONS, TRANSMISSIONS } from '../constants';

import {
    BODY_STYLES_SLUGIFY,
    FUELS_SLUGIFY,
    KIND_WHEELS_SLUGIFY,
    SEASONS_SLUGIFY,
    TRANSMISSIONS_SLUGIFY
} from 'config';
import styles from './index.module.scss';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const CATEGORIES = [
    { name: 'Диски', href: '/wheels' },
    { name: 'Салоны', href: '/cabins ' },
    { name: 'Запчасти', href: '/spare-parts' },
    { name: 'Колеса', href: '/tires' }
];

interface Props {
    page: PageMain;
    reviews: Review[];
    articles: Article[];
    brands: Brand[];
}

const Home: NextPage<Props> = ({ page, brands = [], reviews, articles }) => {
    const [wheelWidths, setWheelWidths] = useState<WheelWidth[]>([]);
    const [diskOffsets, setDiskOffsets] = useState<WheelDiskOffset[]>([]);
    const [numberHoles, setNumberHoles] = useState<WheelNumberHole[]>([]);
    const [diameterCenterHoles, setDiameterCenterHoles] = useState<WheelDiameterCenterHole[]>([]);
    const [wheelDiameters, setWheelDiameters] = useState<WheelDiameter[]>([]);

    const [tireBrands, setTireBrands] = useState<TireBrand[]>([]);
    const [tireWidths, setTireWidths] = useState<TireWidth[]>([]);
    const [heights, setHeights] = useState<TireHeight[]>([]);
    const [tireDiameters, setTireDiameters] = useState<TireDiameter[]>([]);

    const [models, setModels] = useState<Model[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({ data: [], meta: {} });
    const [values, setValues] = useState<{ [key: string]: string | null }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [productType, setProductType] = useState<ProductType>('sparePart');
    const [isOpenedModal, setIsOpenModal] = useState<boolean>(false);
    const [isOpenedProductTypeModal, setIsOpenedProductTypeModal] = useState<boolean>(false);
    const router = useRouter();

    const loadKindSpareParts = async () => {
        const { data } = await fetchKindSpareParts({
            filters: { type: productType === 'cabin' ? 'cabin' : 'regular' },
            pagination: { start: kindSpareParts.data.length }
        });
        setKindSpareParts({ data: [...kindSpareParts.data, ...data.data], meta: data.meta });
    };

    const [throttledLoadMoreKindSpareParts] = useThrottle(async () => {
        setIsLoadingMore(true);
        await loadKindSpareParts();
        setIsLoadingMore(false);
    });

    const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    const { enqueueSnackbar } = useSnackbar();

    const fetchKindSparePartsRef = useRef(async (value: string) => {
        setIsLoading(true);
        const { data } = await fetchKindSpareParts({ filters: { name: { $contains: value } } });
        setKindSpareParts(data);
        setIsLoading(false);
    });
    const debouncedFetchKindSparePartsRef = useDebounce(fetchKindSparePartsRef.current, 300);

    const updateValue = (id: string, selected: { value: string } | string | null) => {
        let value = typeof selected === 'string' ? selected : selected?.value || null;
        setValues((prevValues) => ({ ...prevValues, [id]: value }));
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

    const handleChangeBrandAutocomplete = (_: any, selected: { value: string; label: string } | null) => {
        updateValue('brand', selected);
        updateValue('model', null);
        updateValue('generation', null);
        setModels([]);
        setGenerations([]);
    };

    const handleChangeModelAutocomplete = (_: any, selected: { value: string; label: string } | null) => {
        updateValue('model', selected);
        updateValue('generation', null);
        setGenerations([]);
    };

    const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;
    const handleOpenAutocompleteModel = handleOpenAutocomplete<Model>(!!models.length, setModels, () =>
        fetchModels({
            filters: { brand: { slug: values.brand } },
            pagination: { limit: API_MAX_LIMIT }
        })
    );

    const handleOpenAutocompleteGeneration = handleOpenAutocomplete<Generation>(
        !!generations.length,
        setGenerations,
        () =>
            fetchGenerations({
                filters: { model: { slug: values.model as string }, brand: { slug: values.brand } },
                pagination: { limit: API_MAX_LIMIT }
            })
    );

    const handleOpenAutocompleteKindSparePart = async () => {
        if (!kindSpareParts.data.length) {
            setIsLoading(true);
            await loadKindSpareParts();
            setIsLoading(false);
        }
    };

    const handleInputChangeKindSparePart = (_: any, value: string) => {
        debouncedFetchKindSparePartsRef(value);
    };

    const handleScrollKindSparePartAutocomplete: UIEventHandler<HTMLDivElement> & UIEventHandler<HTMLUListElement> = (
        event
    ) => {
        if (
            event.currentTarget.scrollTop + event.currentTarget.offsetHeight + OFFSET_SCROLL_LOAD_MORE >=
            event.currentTarget.scrollHeight
        ) {
            throttledLoadMoreKindSpareParts();
        }
    };

    const handleChangeAutocomplete =
        (id: string) => (_: any, selected: { value: string; label: string } | string | null) => {
            updateValue(id, selected);
        };

    const handleClickFind = () => {
        let { brand, model, ...restValues } = values;
        let sanitazedValues = Object.keys(restValues).reduce(
            (prev, curr) => (restValues[curr] ? { ...prev, [curr]: restValues[curr] } : prev),
            {}
        );

        const query = qs.stringify(sanitazedValues, { encode: false });
        const formattedQuery = `${query ? `?${query}` : ''}`;

        let url = '/';
        if (productType === 'sparePart' || productType === 'cabin') {
            url = `/${productType === 'sparePart' ? 'spare-parts' : 'cabins'}/${
                model ? `${brand}/model-${model}` : brand ? `${brand}` : ''
            }${formattedQuery}`;
        } else if (productType === 'wheel') {
            url = `/wheels/${brand ? `${brand}` : ''}${formattedQuery}`;
        } else if (productType === 'tire') {
            url = `/tires/${brand ? `${brand}` : ''}${formattedQuery}`;
        }
        router.push(url);
    };

    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleClickOpenFilters = () => {
        setIsOpenModal(true);
    };

    const handleCloseModal = () => {
        setIsOpenModal(false);
    };

    const handleCloseProductTypeModal = () => {
        setIsOpenedProductTypeModal(false);
    };

    const handleKeyDownSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchValue) {
            setIsOpenedProductTypeModal(true);
        }
    };

    const handleChangeProductType = (event: SelectChangeEvent<ProductType>) => {
        setProductType(event.target.value as ProductType);
        setValues({});
        setKindSpareParts({ data: [], meta: {} });
    };

    const handleClickSearchIn = (catalogUrl: string) => () => {
        router.push(`${catalogUrl}?searchValue=${searchValue}`);
    };

    const brandAutocompleteConfig = {
        id: 'brand',
        placeholder: 'Марка',
        options: brands.map((item) => ({ label: item.name, value: item.slug })),
        onChange: handleChangeBrandAutocomplete,
        noOptionsText: noOptionsText
    };

    const modelAutocompleteConfig = {
        id: 'model',
        placeholder: 'Модель',
        disabled: !values.brand,
        options: models.map((item) => ({ label: item.name, value: item.slug })),
        onChange: handleChangeModelAutocomplete,
        onOpen: handleOpenAutocompleteModel,
        noOptionsText: noOptionsText
    };

    const sparePartsAndCabinsFiltersConfig = [
        brandAutocompleteConfig,
        modelAutocompleteConfig,
        {
            id: 'generation',
            placeholder: 'Поколение',
            disabled: !values.model,
            options: generations.map((item) => ({ label: item.name, value: item.slug })),
            onOpen: handleOpenAutocompleteGeneration,
            noOptionsText: noOptionsText
        },

        {
            id: 'kindSparePart',
            placeholder: 'Вид запчасти',
            options: kindSpareParts.data.map((item) => ({ label: item.name, value: item.slug })),
            loadingMore: isLoadingMore,
            onScroll: handleScrollKindSparePartAutocomplete,
            onOpen: handleOpenAutocompleteKindSparePart,
            onInputChange: handleInputChangeKindSparePart,
            noOptionsText: noOptionsText
        },
        {
            id: 'bodyStyle',
            placeholder: 'Кузов',
            options: BODY_STYLES.map((item) => ({ label: item, value: BODY_STYLES_SLUGIFY[item] }))
        },

        {
            id: 'transmission',
            placeholder: 'Коробка',
            options: TRANSMISSIONS.map((item) => ({ label: item, value: TRANSMISSIONS_SLUGIFY[item] }))
        },

        {
            id: 'fuel',
            placeholder: 'Тип топлива',
            options: FUELS.map((item) => ({ label: item, value: FUELS_SLUGIFY[item] }))
        }
    ];

    const filtersConfig: {
        [key: string]: {
            id: string;
            placeholder: string;
            disabled?: boolean;
            options: readonly (string | { label: string; value: string })[];
            onOpen?: () => void;
            onChange?: (
                _: any,
                selected: {
                    value: string;
                    label: string;
                } | null
            ) => void;
            onScroll?: UIEventHandler<HTMLDivElement> & UIEventHandler<HTMLUListElement>;
            loadingMore?: boolean;
            onInputChange?: (_: any, value: string) => void;
            noOptionsText?: ReactNode;
        }[];
    } = {
        sparePart: sparePartsAndCabinsFiltersConfig,
        cabin: sparePartsAndCabinsFiltersConfig,
        wheel: [
            {
                id: 'kind',
                placeholder: 'Тип диска',
                options: KIND_WHEELS.map((item) => ({ label: item, value: KIND_WHEELS_SLUGIFY[item] }))
            },
            brandAutocompleteConfig,
            {
                id: 'width',
                placeholder: 'J ширина, мм',
                options: wheelWidths.map((item) => item.name.toString()),
                onOpen: handleOpenAutocomplete<WheelWidth>(!!wheelWidths.length, setWheelWidths, () =>
                    fetchWheelWidths({
                        pagination: { limit: API_MAX_LIMIT }
                    })
                ),
                noOptionsText: noOptionsText
            },
            {
                id: 'diameter',
                placeholder: 'R диаметр, дюйм',
                options: wheelDiameters.map((item) => item.name),
                onOpen: handleOpenAutocomplete<WheelDiameter>(!!wheelDiameters.length, setWheelDiameters, () =>
                    fetchWheelDiameters({
                        pagination: { limit: API_MAX_LIMIT }
                    })
                ),
                noOptionsText: noOptionsText
            },
            {
                id: 'numberHoles',
                placeholder: 'Количество отверстий',
                options: numberHoles.map((item) => item.name.toString()),
                onOpen: handleOpenAutocomplete<WheelNumberHole>(!!numberHoles.length, setNumberHoles, () =>
                    fetchWheelNumberHoles({
                        pagination: { limit: API_MAX_LIMIT }
                    })
                ),
                noOptionsText: noOptionsText
            },
            {
                id: 'diameterCenterHole',
                placeholder: 'DIA диаметр центрального отверстия, мм',
                options: diameterCenterHoles.map((item) => item.name.toString()),
                onOpen: handleOpenAutocomplete<WheelDiameterCenterHole>(
                    !!diameterCenterHoles.length,
                    setDiameterCenterHoles,
                    () =>
                        fetchWheelDiameterCenterHoles({
                            pagination: { limit: API_MAX_LIMIT }
                        })
                ),
                noOptionsText: noOptionsText
            },
            {
                id: 'diskOffset',
                placeholder: 'PCD расстояние между отверстиями, мм',
                options: diskOffsets.map((item) => item.name.toString()),
                onOpen: handleOpenAutocomplete<WheelDiskOffset>(!!diskOffsets.length, setDiskOffsets, () =>
                    fetchWheelDiskOffsets({
                        pagination: { limit: API_MAX_LIMIT }
                    })
                ),
                noOptionsText: noOptionsText
            }
        ],
        tire: [
            {
                id: 'brand',
                placeholder: 'Марка',
                options: tireBrands.map((item) => ({ label: item.name, value: item.slug })),
                onOpen: handleOpenAutocomplete<TireBrand>(!!tireBrands.length, setTireBrands, () =>
                    fetchTireBrands({
                        pagination: { limit: API_MAX_LIMIT }
                    })
                ),
                noOptionsText: noOptionsText
            },

            {
                id: 'width',
                placeholder: 'Ширина',
                options: tireWidths.map((item) => item.name.toString()),
                onOpen: handleOpenAutocomplete<TireWidth>(!!tireWidths.length, setTireWidths, () =>
                    fetchTireWidths({
                        pagination: { limit: API_MAX_LIMIT }
                    })
                ),
                noOptionsText: noOptionsText
            },

            {
                id: 'height',
                placeholder: 'Высота',
                options: heights.map((item) => item.name.toString()),
                onOpen: handleOpenAutocomplete<TireHeight>(!!heights.length, setHeights, () =>
                    fetchTireHeights({
                        pagination: { limit: API_MAX_LIMIT }
                    })
                ),
                noOptionsText: noOptionsText
            },

            {
                id: 'diameter',
                placeholder: 'Диаметр',
                options: tireDiameters.map((item) => item.name),
                onOpen: handleOpenAutocomplete<TireDiameter>(!!tireDiameters.length, setTireDiameters, () =>
                    fetchTireDiameters({
                        pagination: { limit: API_MAX_LIMIT }
                    })
                ),
                noOptionsText: noOptionsText
            },
            {
                id: 'season',
                placeholder: 'Сезон',
                options: SEASONS.map((item) => ({ label: item, value: SEASONS_SLUGIFY[item] }))
            }
        ]
    };

    const renderProductTypeSelect = (
        <Select
            fullWidth
            variant='standard'
            MenuProps={{ disableScrollLock: true }}
            value={productType}
            sx={{ background: '#fff', paddingLeft: '1em', height: '33px' }}
            className={styles.select}
            onChange={handleChangeProductType}>
            {[
                { label: 'Запчасти', value: 'sparePart' },
                { label: 'Салоны', value: 'cabin' },
                { label: 'Шины', value: 'tire' },
                { label: 'Диски', value: 'wheel' }
            ].map((item) => (
                <MenuItem key={item.value} value={item.value}>
                    {item.label}
                </MenuItem>
            ))}
        </Select>
    );

    const renderMobileFilters = (
        <Box marginTop='3em'>
            <Input
                sx={{ bgcolor: '#fff', maxWidth: 300, padding: '0.25em 1em' }}
                fullWidth
                placeholder='Поиск'
                value={searchValue}
                onKeyDown={handleKeyDownSearch}
                onChange={handleChangeSearch}></Input>
            <Box marginTop='1em'>
                <Button variant='contained' onClick={handleClickOpenFilters} startIcon={<TuneIcon></TuneIcon>}>
                    Фильтр
                </Button>
            </Box>
            <Modal open={isOpenedProductTypeModal} onClose={handleCloseProductTypeModal}>
                <Container>
                    <Box padding='1em' borderRadius='1em' marginY='2em' bgcolor='#fff'>
                        <Typography textAlign='center' variant='h6' gutterBottom>
                            Где искать?
                        </Typography>
                        <Button
                            onClick={handleClickSearchIn('/spare-parts')}
                            sx={{ marginBottom: '1em' }}
                            fullWidth
                            variant='contained'>
                            В запчастях
                        </Button>
                        <Button
                            onClick={handleClickSearchIn('/cabins')}
                            sx={{ marginBottom: '1em' }}
                            fullWidth
                            variant='contained'>
                            В салонах
                        </Button>
                        <Button
                            onClick={handleClickSearchIn('/tires')}
                            sx={{ marginBottom: '1em' }}
                            fullWidth
                            variant='contained'>
                            В шинах
                        </Button>
                        <Button
                            onClick={handleClickSearchIn('/wheels')}
                            sx={{ marginBottom: '1em' }}
                            fullWidth
                            variant='contained'>
                            В дисках
                        </Button>
                    </Box>
                </Container>
            </Modal>
            <Modal open={isOpenedModal} onClose={handleCloseModal}>
                <Container>
                    <Box marginY='2em' bgcolor='#fff'>
                        <Box>{renderProductTypeSelect}</Box>
                        {filtersConfig[productType].map((item) => {
                            let value = (item.options as any[]).every((option: any) => typeof option === 'string')
                                ? values[item.id]
                                : (item.options as any[]).find((option) => option.value === values[item.id]);
                            return (
                                <Box key={item.id}>
                                    <Autocomplete
                                        sx={{ paddingY: '2em' }}
                                        options={item.options}
                                        noOptionsText={item.noOptionsText}
                                        onOpen={item.onOpen}
                                        placeholder={item.placeholder}
                                        onScroll={item.onScroll}
                                        onChange={item.onChange || handleChangeAutocomplete(item.id)}
                                        fullWidth
                                        onInputChange={item.onInputChange}
                                        disabled={item.disabled}
                                        value={value || null}></Autocomplete>
                                </Box>
                            );
                        })}
                        <Button onClick={handleClickFind} variant='contained' fullWidth>
                            Подобрать
                        </Button>
                    </Box>
                </Container>
            </Modal>
        </Box>
    );

    const renderDesktopFilters = (
        <Box
            display='flex'
            width='calc(100% - 48px)'
            position='absolute'
            bottom='4em'
            className={styles['head-search']}>
            <Box display='flex' gap='0.5em' flex='1' flexWrap='wrap' className={styles.filters}>
                <Box width={'calc(25% - 0.5em)'}>{renderProductTypeSelect}</Box>
                {filtersConfig[productType].map((item) => {
                    let value = (item.options as any[]).every((option: any) => typeof option === 'string')
                        ? values[item.id]
                        : (item.options as any[]).find((option) => option.value === values[item.id]);
                    return (
                        <Box width={'calc(25% - 0.5em)'} key={item.id}>
                            <Autocomplete
                                options={item.options}
                                noOptionsText={item.noOptionsText}
                                onOpen={item.onOpen}
                                placeholder={item.placeholder}
                                onScroll={item.onScroll}
                                onChange={item.onChange || handleChangeAutocomplete(item.id)}
                                fullWidth
                                onInputChange={item.onInputChange}
                                disabled={item.disabled}
                                value={value || null}></Autocomplete>
                        </Box>
                    );
                })}
            </Box>
            <Button onClick={handleClickFind} variant='contained' className={styles['btn-search']}>
                Подобрать
            </Button>
        </Box>
    );

    return (
        <>
            <Box sx={{ height: { xs: 'calc(100vh - 56px - 60px)', sm: 550 } }} className={styles['head-section']}>
                <Image
                    title={isMobile ? page.bannerMobile?.caption : page.banner?.caption}
                    width={isMobile ? page.bannerMobile?.width : page.banner?.width}
                    height={isMobile ? page.bannerMobile?.height : page.banner?.height}
                    style={{
                        position: 'absolute',
                        top: 0,
                        objectFit: 'cover',
                        width: '100vw',
                        height: '100%',
                        ...(isMobile ? { objectPosition: '70%' } : {})
                    }}
                    src={isMobile ? page.bannerMobile?.url : page.banner?.url || ''}
                    alt={isMobile ? page.bannerMobile?.alternativeText : page.banner?.alternativeText || ''}></Image>
                <Container sx={{ height: '100%', position: 'relative' }}>
                    <Box maxWidth='650px' paddingTop={{ xs: '1em', sm: '3em' }}>
                        <Typography fontWeight='bold' component='h1' variant={isMobile ? 'h4' : 'h3'}>
                            {page.h1}
                        </Typography>
                        <Typography component='h2' variant={isMobile ? 'h5' : 'h4'}>
                            {page.subH1}
                        </Typography>
                    </Box>
                    {isMobile ? renderMobileFilters : renderDesktopFilters}
                </Container>
            </Box>
            <Container>
                <Typography
                    withSeparator
                    component='h2'
                    variant={isMobile ? 'h5' : 'h4'}
                    sx={{ marginBottom: { xs: '0.5em', md: '1.5em' } }}
                    fontWeight='bold'
                    textTransform='uppercase'>
                    {page.titleCategories}
                </Typography>
                <Box
                    className={styles.categories}
                    display='flex'
                    sx={{
                        flexWrap: { xs: 'wrap', md: 'initial' },
                        gap: { xs: '5%', md: 'initial' },
                        marginBottom: { xs: '2em', md: '4em' }
                    }}>
                    {page.categoryImages?.map((item, i) => (
                        <Box
                            key={item.id}
                            className={classNames(styles.categories__item, isMobile && styles.categories__item_mobile)}>
                            <NextLink href={CATEGORIES[i].href}>
                                <Box
                                    position='relative'
                                    zIndex={1}
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='center'
                                    minHeight='250px'>
                                    <Image
                                        title={item.caption}
                                        src={item.url}
                                        width={item.width}
                                        height={item.height}
                                        alt={item.alternativeText}></Image>
                                </Box>
                                <Typography
                                    className={styles['categories__item-name']}
                                    marginBottom='0.25em'
                                    textAlign='center'
                                    component='h3'
                                    variant='h4'>
                                    <Link component='span' underline='hover' color='inherit'>
                                        {CATEGORIES[i].name}
                                    </Link>
                                </Typography>
                            </NextLink>
                        </Box>
                    ))}
                    <Box
                        position='relative'
                        className={classNames(styles.categories__item, isMobile && styles.categories__item_mobile)}>
                        <Image
                            width={260}
                            height={300}
                            alt='Выкуп авто на з/ч'
                            isOnSSR={false}
                            style={isMobile ? { objectFit: 'cover' } : {}}
                            src='/main_buyback.png'></Image>
                        <NextLink href={'/buyback-cars'}>
                            <Link
                                position='absolute'
                                top={'5px'}
                                variant={isMobile ? 'h5' : 'h4'}
                                textTransform='uppercase'
                                fontWeight='bold'
                                component='span'
                                display='block'
                                underline='hover'
                                margin='0.25em 0.125em'
                                color='inherit'>
                                Выкуп <br /> авто на з/ч
                            </Link>
                        </NextLink>
                    </Box>
                </Box>
                {isMobile ? (
                    <Box paddingX='1em'>
                        <Slider slidesToShow={2}>
                            {page.benefits?.map((item) => (
                                <Box paddingX='0.5em' key={item.id}>
                                    <LinkWithImage
                                        withoutTitle
                                        link={item.link}
                                        image={item.image}
                                        width={200}
                                        height={140}></LinkWithImage>
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                ) : (
                    <Box flexWrap='wrap' marginBottom='4em' justifyContent='space-between' display='flex'>
                        {page.benefits?.map((item) => (
                            <LinkWithImage
                                key={item.id}
                                withoutTitle
                                link={item.link}
                                image={item.image}
                                width={200}
                                height={140}></LinkWithImage>
                        ))}
                    </Box>
                )}
                {isTablet ? (
                    <Box paddingX='1em' marginBottom='2em'>
                        <Slider slidesToShow={2}>
                            {page.serviceStations?.map((item) => (
                                <Box key={item.id} paddingX='0.5em'>
                                    <WhiteBox>
                                        <LinkWithImage
                                            height={100}
                                            width={isMobile ? 150 : 264}
                                            image={item.image}
                                            imageStyle={{ maxWidth: '100%', objectFit: 'contain', margin: 'auto' }}
                                            typographyProps={{ minHeight: '64px', variant: 'h6', marginTop: '1em' }}
                                            link={`/service-stations/${item.slug}`}></LinkWithImage>
                                    </WhiteBox>
                                </Box>
                            ))}
                            {page.autocomises?.map((item) => (
                                <Box key={item.id} paddingX='0.5em'>
                                    <WhiteBox>
                                        <LinkWithImage
                                            imageStyle={{ maxWidth: '100%', objectFit: 'contain', margin: 'auto' }}
                                            height={100}
                                            width={isMobile ? 150 : 208}
                                            image={item.image}
                                            typographyProps={{ minHeight: '64px', variant: 'h6', marginTop: '1em' }}
                                            link={`/autocomises/${item.slug}`}></LinkWithImage>
                                    </WhiteBox>
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                ) : (
                    <Box display='flex' gap={'2em'} marginBottom='4em' justifyContent='space-between'>
                        {page.serviceStations?.map((item) => (
                            <Box bgcolor='#fff' padding='1em' sx={{ width: { xs: 'auto', md: '22.5%' } }} key={item.id}>
                                <LinkWithImage
                                    // height={100}
                                    imageStyle={{ width: '100%', objectFit: 'contain' }}
                                    width={264}
                                    image={item.image}
                                    link={`/service-stations/${item.slug}`}></LinkWithImage>
                            </Box>
                        ))}
                        {page.autocomises?.map((item) => (
                            <Box bgcolor='#fff' padding='1em' sx={{ width: { xs: 'auto', md: '22.5%' } }} key={item.id}>
                                <LinkWithImage
                                    imageStyle={{ width: '100%', objectFit: 'contain' }}
                                    // height={100}
                                    width={264}
                                    image={item.image}
                                    link={`/autocomises/${item.slug}`}></LinkWithImage>
                            </Box>
                        ))}
                    </Box>
                )}
                <Box marginBottom='4em'>
                    <Typography
                        withSeparator
                        component='h2'
                        variant={isMobile ? 'h5' : 'h4'}
                        sx={{ marginBottom: { xs: '0.5em', md: '1.5em' } }}
                        fontWeight='bold'
                        maxWidth='700px'
                        textTransform='uppercase'>
                        {page.popularBrandsTitle}
                    </Typography>
                </Box>
                <Box paddingX='1em' marginBottom='2em'>
                    <Slider rows={isMobile ? 1 : 2} slidesToShow={isMobile ? 2 : isTablet ? 4 : 7}>
                        {brands.map((item) => (
                            <WhiteBox
                                marginX='auto'
                                marginBottom={{ xs: 0, sm: '1em' }}
                                width={137}
                                padding='1em 0'
                                key={item.id}>
                                <LinkWithImage
                                    width={100}
                                    height={40}
                                    caption={item.name}
                                    link={`/spare-parts/${item.slug}`}
                                    image={item.image}
                                    typographyProps={{ fontWeight: 'bold', variant: 'body1' }}></LinkWithImage>
                            </WhiteBox>
                        ))}
                    </Slider>
                </Box>

                <Box
                    display='flex'
                    gap='3em'
                    sx={{ marginBottom: { xs: '2em', md: '5em' }, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    <Box display='flex' alignItems='center'>
                        <Typography color='text.secondary' variant='body1'>
                            <ReactMarkdown content={page.leftSideText}></ReactMarkdown>
                        </Typography>
                    </Box>
                    <Box width={'100%'}>
                        <ReactPlayer width={isMobile ? '100%' : 600} height={300} url={page.videoUrl}></ReactPlayer>
                    </Box>
                </Box>
                <Typography withSeparator component='h2' variant={isMobile ? 'h5' : 'h4'} fontWeight='bold'>
                    {page.reviewsTitle}
                </Typography>
                <Box marginBottom={isMobile ? '3em' : '5em'}>
                    <CarouselReviews
                        marginBottom='1em'
                        data={reviews}
                        slidesToShow={isMobile ? 1 : isTablet ? 2 : 4}></CarouselReviews>
                    <Box gap={{ xs: 2, md: 0 }} flexWrap='wrap' display='flex' justifyContent='center'>
                        <Button
                            sx={{ marginRight: { md: '5em', xs: 0 }, marginLeft: { md: '1em', xs: 0 } }}
                            variant='contained'
                            target='_blank'
                            href='https://g.page/r/CZioQh24913HEB0/review'>
                            Оставить отзыв гугл
                        </Button>
                        <Button
                            sx={{ marginLeft: { xs: 0, md: '0.5em' } }}
                            variant='contained'
                            target='_blank'
                            href='https://yandex.by/maps/org/magazin_avtozapchastey_i_avtotovarov/1032020244/reviews/?add-review=true&ll=23.853612%2C53.583955&z=16'>
                            Оставить отзыв Яндекс
                        </Button>
                    </Box>
                </Box>
                <Box marginBottom='1em'>
                    <Typography
                        fontWeight='bold'
                        maxWidth='500px'
                        withSeparator
                        component='h2'
                        variant={isMobile ? 'h5' : 'h4'}
                        marginBottom='1em'>
                        {page.benefitsTitle}
                    </Typography>
                    <Box display='flex' flexDirection={isMobile ? 'column-reverse' : 'initial'}>
                        <Typography flex='1' color='text.secondary' variant='body1'>
                            <ReactMarkdown content={page.benefitsLeftText}></ReactMarkdown>
                        </Typography>
                        <Box marginTop={isMobile ? '0' : '-2em'}>
                            <Image
                                title={page.benefitsRightImage?.caption}
                                src={page.benefitsRightImage?.url}
                                style={isMobile ? { maxWidth: '100%', objectFit: 'contain', height: 'auto' } : {}}
                                width={617}
                                height={347}
                                alt={page.benefitsRightImage?.alternativeText}></Image>
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <Typography
                        fontWeight='bold'
                        withSeparator
                        component='h2'
                        variant={isMobile ? 'h5' : 'h4'}
                        marginBottom='1em'>
                        {page.blogTitle}
                    </Typography>
                    <Box
                        padding='0 2.5em'
                        display='flex'
                        flexWrap='wrap'
                        sx={{ flexDirection: { xs: 'column', md: 'initial' }, gap: { xs: '1em', md: '4em' } }}>
                        <Typography
                            sx={{ paddingBottom: { xs: '0.5em', md: '2em' } }}
                            flex='1'
                            color='text.secondary'
                            variant='body1'>
                            <ReactMarkdown content={page.blogLeftText}></ReactMarkdown>
                        </Typography>
                        <Box
                            sx={{
                                borderBottom: {
                                    xs: '1px solid rgba(0, 0, 0, 0.3)',
                                    md: 'none',
                                    borderRight: { xs: 'none', md: '1px solid rgba(0, 0, 0, 0.3)' }
                                }
                            }}></Box>
                        <Typography
                            sx={{ paddingBottom: { xs: '0', md: '2em' } }}
                            flex='1'
                            color='text.secondary'
                            variant='body1'>
                            <ReactMarkdown content={page.blogRightText}></ReactMarkdown>
                        </Typography>
                    </Box>
                    {isTablet ? (
                        <Box marginBottom='1em' paddingX='1em'>
                            <Slider slidesToShow={1}>
                                {articles.map((item) => (
                                    <Box paddingX='0.5em' key={item.id}>
                                        <LinkWithImage
                                            link={`/articles/${item.slug}`}
                                            height={390}
                                            imageStyle={{ objectFit: 'cover', width: '100%' }}
                                            key={item.id}
                                            width={390}
                                            typographyProps={{ width: '100%', variant: 'h6', marginTop: '1em' }}
                                            caption={item.name}
                                            image={item.image}></LinkWithImage>
                                    </Box>
                                ))}
                            </Slider>
                        </Box>
                    ) : (
                        <Box display='flex' gap={'1em'} marginBottom='3.5em'>
                            {articles.map((item) => (
                                <LinkWithImage
                                    link={`/articles/${item.slug}`}
                                    height={390}
                                    imageStyle={{ objectFit: 'cover', maxWidth: '100%' }}
                                    key={item.id}
                                    width={390}
                                    typographyProps={{ maxWidth: 390, variant: 'h6', marginTop: '1em' }}
                                    caption={item.name}
                                    image={item.image}></LinkWithImage>
                            ))}
                        </Box>
                    )}
                </Box>
                <Box marginBottom='2em'>
                    <Typography
                        fontWeight='bold'
                        withSeparator
                        component='h2'
                        variant={isMobile ? 'h5' : 'h4'}
                        marginBottom='1em'>
                        {page.deliveryTitle}
                    </Typography>
                    <Typography flex='1' color='text.secondary' variant='body1'>
                        <ReactMarkdown content={page.deliveryText}></ReactMarkdown>
                    </Typography>
                </Box>
            </Container>
        </>
    );
};

export default Home;

export const getServerSideProps = getPageProps(
    fetchPage('main', {
        populate: [
            'seo',
            'benefits.image',
            'categoryImages',
            'banner',
            'bannerMobile',
            'benefitsRightImage',
            'autocomises.image',
            'serviceStations.image'
        ]
    }),
    async () => ({
        // TEMPORARY SLICE
        articles: (await fetchArticles({ populate: 'image', pagination: { limit: 3 } })).data.data.slice(0, 3)
    }),
    async () => ({
        reviews: (await fetchReviews()).data.data
    }),
    () => ({ hasGlobalContainer: false, hideSEOBox: true })
);
