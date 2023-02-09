import type { NextPage } from 'next';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { Box, Button, CircularProgress, Link, TextField, useMediaQuery } from '@mui/material';

import { Dispatch, SetStateAction, UIEventHandler, useMemo, useRef, useState } from 'react';
import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { KindSparePart } from 'api/kindSpareParts/types';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import { ApiResponse } from 'api/types';
import { fetchModels } from 'api/models/models';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { useSnackbar } from 'notistack';
import { fetchGenerations } from 'api/generations/generations';
import { Generation } from 'api/generations/types';
import { getPageProps } from 'services/PagePropsService';
import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { API_MAX_LIMIT, API_UN_LIMIT } from 'api/constants';
import { useDebounce, useThrottle } from 'rooks';
import { fetchPage } from 'api/pages';
import { PageMain } from 'api/pages/types';
import { EngineVolume } from 'api/engineVolumes/types';
import { fetchEngineVolumes } from 'api/engineVolumes/wheelWidths';
import styles from './index.module.scss';
import { BODY_STYLES, FUELS, OFFSET_SCROLL_LOAD_MORE, TRANSMISSIONS } from '../constants';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import Typography from 'components/Typography';
import CarouselReviews from 'components/CarouselReviews';
import { Container } from '@mui/system';
import Autocomplete from 'components/Autocomplete';
import qs from 'qs';
import Image from 'components/Image';
import NextLink from 'next/link';
import LinkWithImage from 'components/LinkWithImage';
import WhiteBox from 'components/WhiteBox';
import ReactMarkdown from 'components/ReactMarkdown';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const CATEGORIES = [
    { id: 'wheel', href: '/wheels', imgSrc: '/wheels.png', name: 'Диски', imgWidth: 180, imgHeight: 180 },
    { id: 'cabin', href: '/cabins', imgSrc: '/cabins.png', name: 'Салоны', imgWidth: 180, imgHeight: 237 },
    {
        id: 'sparePart',
        href: '/spare-parts',
        name: 'Запчасти',
        imgSrc: '/spare_parts.png',
        imgWidth: 180,
        imgHeight: 136
    },
    { id: 'tire', href: '/tires', name: 'Колеса', imgSrc: '/tires.png', imgWidth: 180, imgHeight: 201 }
];

const ADVANTAGES = ['/advantage_1.png', '/advantage_2.png', '/advantage_3.png', '/advantage_4.png', '/advantage_5.png'];

interface Props {
    page: PageMain;
    reviews: Review[];
    articles: Article[];
    brands: Brand[];
}

const Home: NextPage<Props> = ({ page, brands = [], reviews, articles }) => {
    const [models, setModels] = useState<Model[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({ data: [], meta: {} });
    const [volumes, setVolumes] = useState<EngineVolume[]>([]);
    const [values, setValues] = useState<{ [key: string]: string | null }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const router = useRouter();

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
    const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
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
                filters: { model: { name: values.model } },
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

    const handleOpenAutocompleteVolume = handleOpenAutocomplete<EngineVolume>(!!volumes.length, setVolumes, () =>
        fetchEngineVolumes({
            pagination: { limit: API_MAX_LIMIT }
        })
    );

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
        router.push(
            `/spare-parts/${model ? `${brand}/model-${model}` : brand ? `${brand}` : ''}?` +
                qs.stringify(restValues, { encode: false })
        );
    };

    const filtersConfig = [
        {
            id: 'brand',
            placeholder: 'Марка',
            options: brands.map((item) => ({ label: item.name, value: item.slug })),
            onChange: handleChangeBrandAutocomplete,
            noOptionsText: noOptionsText
        },

        {
            id: 'model',
            placeholder: 'Модель',
            disabled: !values.brand,
            options: models.map((item) => ({ label: item.name, value: item.slug })),
            onChange: handleChangeModelAutocomplete,
            onOpen: handleOpenAutocompleteModel,
            noOptionsText: noOptionsText
        },

        {
            id: 'generation',
            placeholder: 'Поколение',
            disabled: !values.model,
            options: generations.map((item) => item.name),
            onOpen: handleOpenAutocompleteGeneration,
            noOptionsText: noOptionsText
        },

        {
            id: 'kindSparePart',
            placeholder: 'Запчасть',
            options: kindSpareParts.data.map((item) => item.name),
            loadingMore: isLoadingMore,
            onScroll: handleScrollKindSparePartAutocomplete,
            onOpen: handleOpenAutocompleteKindSparePart,
            onInputChange: handleInputChangeKindSparePart,
            noOptionsText: noOptionsText
        },

        {
            id: 'volume',
            placeholder: 'Обьем 2.0',
            options: volumes.map((item) => item.name),
            onOpen: handleOpenAutocompleteVolume,
            noOptionsText: noOptionsText
        },

        {
            id: 'bodyStyle',
            placeholder: 'Кузов',
            options: BODY_STYLES
        },

        {
            id: 'transmission',
            placeholder: 'Коробка',
            type: 'autocomplete',
            options: TRANSMISSIONS
        },

        {
            id: 'fuel',
            placeholder: 'Тип топлива',
            options: FUELS
        }
    ];

    return (
        <>
            <Box className={styles['head-section']}>
                <Image
                    width={1400}
                    height={550}
                    style={{ position: 'absolute', top: 0, objectFit: 'cover', width: '100vw', height: '100%' }}
                    src={page.banner?.url || ''}
                    alt={page.banner?.alternativeText || ''}></Image>
                <Container sx={{ height: '100%', position: 'relative' }}>
                    <Box maxWidth="600px" className={styles['head-text']}>
                        <Typography fontWeight="bold" component="h1" variant="h3">
                            {page.h1}
                        </Typography>
                        <Typography component="h2" variant="h4">
                            {page.subH1}
                        </Typography>
                    </Box>
                    <Box display="flex" width="100%" position="absolute" bottom="4em" className={styles['head-search']}>
                        <Box display="flex" gap="0.5em" flex="1" flexWrap="wrap" className={styles.filters}>
                            {filtersConfig.map((item) => {
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
                        <Button onClick={handleClickFind} variant="contained" className={styles['btn-search']}>
                            Поиск
                        </Button>
                    </Box>
                </Container>
            </Box>
            <Container>
                <Typography
                    withSeparator
                    component="h2"
                    variant="h4"
                    marginBottom="1.5em"
                    fontWeight="bold"
                    textTransform="uppercase">
                    {page.titleCategories}
                </Typography>
                <Box className={styles.categories} marginBottom="4em" display="flex">
                    {CATEGORIES.map((item) => (
                        <Box key={item.id} className={styles.categories__item}>
                            <Box
                                position="relative"
                                zIndex={1}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                minHeight="250px">
                                <Image
                                    isOnSSR={false}
                                    src={item.imgSrc}
                                    width={item.imgWidth}
                                    height={item.imgHeight}
                                    alt={item.name}></Image>
                            </Box>
                            <Typography
                                className={styles['categories__item-name']}
                                marginBottom="0.25em"
                                textAlign="center"
                                variant="h4">
                                <NextLink href={item.href}>
                                    <Link component="span" underline="hover" color="inherit">
                                        {item.name}
                                    </Link>
                                </NextLink>
                            </Typography>
                        </Box>
                    ))}
                    <Box className={styles.categories__item}>
                        <NextLink href={'/buyback-cars'}>
                            <Link
                                variant="h4"
                                textTransform="uppercase"
                                fontWeight="bold"
                                component="span"
                                display="block"
                                underline="hover"
                                margin="0.25em 0.25em"
                                color="inherit">
                                Выкуп авто на з/ч
                            </Link>
                        </NextLink>
                    </Box>
                </Box>
                <Box marginBottom="4em" justifyContent="space-between" display="flex">
                    {page.benefits?.map((item) => (
                        <Image src={item.url} key={item.id} alt={item.alternativeText} width={200} height={140}></Image>
                    ))}
                </Box>
                <Box display="flex" gap={'2em'} marginBottom="4em" justifyContent="space-between">
                    {page.serviceStations?.map((item) => (
                        <WhiteBox width="25%" key={item.id}>
                            <LinkWithImage
                                height={100}
                                image={item.image}
                                link={`/service-stations/${item.slug}`}></LinkWithImage>
                        </WhiteBox>
                    ))}
                    {page.autocomises?.map((item) => (
                        <WhiteBox width="25%" key={item.id}>
                            <LinkWithImage
                                height={100}
                                image={item.image}
                                link={`/autocomises/${item.slug}`}></LinkWithImage>
                        </WhiteBox>
                    ))}
                </Box>
                <Box marginBottom="4em">
                    <Typography
                        withSeparator
                        component="h2"
                        variant="h4"
                        marginBottom="1.5em"
                        fontWeight="bold"
                        maxWidth="700px"
                        textTransform="uppercase">
                        {page.popularBrandsTitle}
                    </Typography>
                </Box>
                <Box display="flex" marginBottom="5em" gap={'0.5em'} flexWrap="wrap">
                    {brands.map((item) => (
                        <WhiteBox width={137} padding="1em 0.5em" key={item.id}>
                            <LinkWithImage
                                width={100}
                                height={40}
                                caption={item.name}
                                link={`/spare-parts/${item.slug}`}
                                image={item.image}
                                typographyProps={{ fontWeight: 'bold', variant: 'body1' }}></LinkWithImage>
                        </WhiteBox>
                    ))}
                </Box>
                <Box display="flex" gap="3em" maxHeight="300px" marginBottom="5em">
                    <Box display="flex" alignItems="center">
                        <Typography color="text.secondary" variant="body1">
                            <ReactMarkdown content={page.leftSideText}></ReactMarkdown>
                        </Typography>
                    </Box>
                    <Box>
                        <ReactPlayer width={600} height={300} url={page.videoUrl}></ReactPlayer>
                    </Box>
                </Box>
                <Typography withSeparator component="h2" variant="h4" fontWeight="bold">
                    {page.reviewsTitle}
                </Typography>
                <CarouselReviews marginBottom="6em" data={reviews} slidesToShow={4}></CarouselReviews>
                <Box marginBottom="1em">
                    <Typography
                        fontWeight="bold"
                        maxWidth="500px"
                        withSeparator
                        component="h2"
                        variant="h4"
                        marginBottom="1em">
                        {page.benefitsTitle}
                    </Typography>
                    <Box display="flex">
                        <Typography flex="1" color="text.secondary" variant="body1">
                            <ReactMarkdown content={page.benefitsLeftText}></ReactMarkdown>
                        </Typography>
                        <Box marginTop="-2em">
                            <Image
                                src={page.benefitsRightImage?.url}
                                width={617}
                                height={347}
                                alt={page.benefitsRightImage?.alternativeText}></Image>
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <Typography fontWeight="bold" withSeparator component="h2" variant="h4" marginBottom="1em">
                        {page.blogTitle}
                    </Typography>
                    <Box padding="0 2.5em" gap={'4em'} display="flex">
                        <Typography paddingBottom="2em" flex="1" color="text.secondary" variant="body1">
                            <ReactMarkdown content={page.blogLeftText}></ReactMarkdown>
                        </Typography>
                        <Box borderRight="1px solid rgba(0, 0, 0, 0.3)"></Box>
                        <Typography paddingBottom="2em" flex="1" color="text.secondary" variant="body1">
                            <ReactMarkdown content={page.blogRightText}></ReactMarkdown>
                        </Typography>
                    </Box>
                    <Box display="flex" gap={'1em'} marginBottom="3.5em">
                        {articles.map((item) => (
                            <LinkWithImage
                                link={`/articles/${item.slug}`}
                                height={390}
                                imageStyle={{ objectFit: 'cover' }}
                                key={item.id}
                                width={390}
                                caption={item.name}
                                image={item.image}></LinkWithImage>
                        ))}
                    </Box>
                </Box>
                <Box marginBottom="2em">
                    <Typography fontWeight="bold" withSeparator component="h2" variant="h4" marginBottom="1em">
                        {page.deliveryTitle}
                    </Typography>
                    <Typography flex="1" color="text.secondary" variant="body1">
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
        populate: ['seo', 'benefits', 'categoryImages', 'banner', 'benefitsRightImage']
    }),
    async () => ({
        articles: (await fetchArticles({ populate: 'image', pagination: { limit: 3 } })).data.data
    }),
    async () => ({
        reviews: (await fetchReviews()).data.data
    }),
    () => ({ hasGlobalContainer: false, hideSEOBox: true })
);
