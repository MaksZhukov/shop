import type { NextPage } from 'next';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { Box, Button, CircularProgress, Input, Link, Modal, TextField, useMediaQuery } from '@mui/material';

import { Dispatch, SetStateAction, UIEventHandler, useMemo, useRef, useState, ChangeEvent, KeyboardEvent } from 'react';
import { Brand } from 'api/brands/types';
import { Model } from 'api/models/types';
import { KindSparePart } from 'api/kindSpareParts/types';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import { ApiResponse, Image as IImage } from 'api/types';
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
import TuneIcon from '@mui/icons-material/Tune';
import classNames from 'classnames';
import Slider from 'react-slick';

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
    const [models, setModels] = useState<Model[]>([]);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [kindSpareParts, setKindSpareParts] = useState<ApiResponse<KindSparePart[]>>({ data: [], meta: {} });
    const [volumes, setVolumes] = useState<EngineVolume[]>([]);
    const [values, setValues] = useState<{ [key: string]: string | null }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [isOpenedModal, setIsOpenModal] = useState<boolean>(false);
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

    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleClickOpenFilters = () => {
        setIsOpenModal(true);
    };

    const handleCloseModal = () => {
        setIsOpenModal(false);
    };

    const handleKeyDownSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            let { brand, model, ...restValues } = values;
            router.push(
                `/spare-parts/${model ? `${brand}/model-${model}` : brand ? `${brand}` : ''}?` +
                    qs.stringify({ ...restValues, searchValue }, { encode: false })
            );
        }
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

    const renderMobileFilters = (
        <Box marginTop="1em">
            <Input
                sx={{ bgcolor: '#fff', maxWidth: 300, padding: '0.25em 1em' }}
                fullWidth
                placeholder="Поиск"
                value={searchValue}
                onKeyDown={handleKeyDownSearch}
                onChange={handleChangeSearch}></Input>
            <Box marginTop="1em">
                <Button variant="contained" onClick={handleClickOpenFilters} startIcon={<TuneIcon></TuneIcon>}>
                    Параметры
                </Button>
            </Box>
            <Modal open={isOpenedModal} onClose={handleCloseModal}>
                <Container>
                    <Box marginY="2em" bgcolor="#fff">
                        {' '}
                        {filtersConfig.map((item) => {
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
                        <Button onClick={handleClickFind} variant="contained" fullWidth>
                            Поиск
                        </Button>
                    </Box>
                </Container>
            </Modal>
        </Box>
    );

    const renderDesktopFilters = (
        <Box
            display="flex"
            width="calc(100% - 48px)"
            position="absolute"
            bottom="4em"
            className={styles['head-search']}>
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
    );

    return (
        <>
            <Box sx={{ height: { xs: 400, sm: 550 } }} className={styles['head-section']}>
                <Image
                    title={page.banner?.caption}
                    width={page.banner?.width}
                    height={page.banner?.height}
                    style={{
                        position: 'absolute',
                        top: 0,
                        objectFit: 'cover',
                        width: '100vw',
                        height: '100%',
                        ...(isMobile ? { objectPosition: '25%' } : {})
                    }}
                    src={page.banner?.url || ''}
                    alt={page.banner?.alternativeText || ''}></Image>
                <Container sx={{ height: '100%', position: 'relative' }}>
                    <Box maxWidth="600px" className={styles['head-text']}>
                        <Typography fontWeight="bold" component="h1" variant={isMobile ? 'h4' : 'h3'}>
                            {page.h1}
                        </Typography>
                        <Typography component="h2" variant={isMobile ? 'h5' : 'h4'}>
                            {page.subH1}
                        </Typography>
                    </Box>
                    {isMobile ? renderMobileFilters : renderDesktopFilters}
                </Container>
            </Box>
            <Container>
                <Typography
                    withSeparator
                    component="h2"
                    variant={isMobile ? 'h5' : 'h4'}
                    sx={{ marginBottom: { xs: '0.5em', md: '1.5em' } }}
                    fontWeight="bold"
                    textTransform="uppercase">
                    {page.titleCategories}
                </Typography>
                <Box
                    className={styles.categories}
                    display="flex"
                    sx={{
                        flexWrap: { xs: 'wrap', md: 'initial' },
                        gap: { xs: '5%', md: 'initial' },
                        marginBottom: { xs: '2em', md: '4em' }
                    }}>
                    {page.categoryImages?.map((item, i) => (
                        <Box
                            key={item.id}
                            className={classNames(styles.categories__item, isMobile && styles.categories__item_mobile)}>
                            <Box
                                position="relative"
                                zIndex={1}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                minHeight="250px">
                                <Image
                                    title={item.caption}
                                    src={item.url}
                                    width={item.width}
                                    height={item.height}
                                    alt={item.alternativeText}></Image>
                            </Box>
                            <Typography
                                className={styles['categories__item-name']}
                                marginBottom="0.25em"
                                textAlign="center"
                                variant="h4">
                                <NextLink href={CATEGORIES[i].href}>
                                    <Link component="span" underline="hover" color="inherit">
                                        {CATEGORIES[i].name}
                                    </Link>
                                </NextLink>
                            </Typography>
                        </Box>
                    ))}
                    <Box className={classNames(styles.categories__item, isMobile && styles.categories__item_mobile)}>
                        <NextLink href={'/buyback-cars'}>
                            <Link
                                variant={isMobile ? 'h5' : 'h4'}
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
                {isMobile ? (
                    <Box paddingX="1em">
                        <Slider slidesToShow={2}>
                            {page.benefits?.map((item) => (
                                <Box paddingX="0.5em" key={item.id}>
                                    <Image
                                        title={item.caption}
                                        src={item.url}
                                        key={item.id}
                                        alt={item.alternativeText}
                                        width={200}
                                        height={140}></Image>
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                ) : (
                    <Box flexWrap="wrap" marginBottom="4em" justifyContent="space-between" display="flex">
                        {page.benefits?.map((item) => (
                            <Image
                                title={item.caption}
                                src={item.url}
                                key={item.id}
                                alt={item.alternativeText}
                                width={200}
                                height={140}></Image>
                        ))}
                    </Box>
                )}
                {isTablet ? (
                    <Box paddingX="1em" marginBottom="2em">
                        <Slider slidesToShow={2}>
                            {page.serviceStations?.map((item) => (
                                <Box key={item.id} paddingX="0.5em">
                                    <WhiteBox>
                                        <LinkWithImage
                                            height={100}
                                            width={264}
                                            image={item.image}
                                            imageStyle={{ maxWidth: '100%', objectFit: 'contain', margin: 'auto' }}
                                            typographyProps={{ minHeight: '64px', variant: 'h6', marginTop: '1em' }}
                                            link={`/service-stations/${item.slug}`}></LinkWithImage>
                                    </WhiteBox>
                                </Box>
                            ))}
                            {page.autocomises?.map((item) => (
                                <Box key={item.id} paddingX="0.5em">
                                    <WhiteBox>
                                        <LinkWithImage
                                            imageStyle={{ maxWidth: '100%', objectFit: 'contain', margin: 'auto' }}
                                            height={100}
                                            image={item.image}
                                            typographyProps={{ minHeight: '64px', variant: 'h6', marginTop: '1em' }}
                                            link={`/autocomises/${item.slug}`}></LinkWithImage>
                                    </WhiteBox>
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                ) : (
                    <Box display="flex" gap={'2em'} marginBottom="4em" justifyContent="space-between">
                        {page.serviceStations?.map((item) => (
                            <Box bgcolor="#fff" padding="1em" sx={{ width: { xs: 'auto', md: '22.5%' } }} key={item.id}>
                                <LinkWithImage
                                    // height={100}
                                    imageStyle={{ width: '100%', objectFit: 'contain' }}
                                    width={264}
                                    image={item.image}
                                    link={`/service-stations/${item.slug}`}></LinkWithImage>
                            </Box>
                        ))}
                        {page.autocomises?.map((item) => (
                            <Box bgcolor="#fff" padding="1em" sx={{ width: { xs: 'auto', md: '22.5%' } }} key={item.id}>
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
                <Box marginBottom="4em">
                    <Typography
                        withSeparator
                        component="h2"
                        variant={isMobile ? 'h5' : 'h4'}
                        sx={{ marginBottom: { xs: '0.5em', md: '1.5em' } }}
                        fontWeight="bold"
                        maxWidth="700px"
                        textTransform="uppercase">
                        {page.popularBrandsTitle}
                    </Typography>
                </Box>
                {isMobile ? (
                    <Box paddingX="1em" marginBottom="2em">
                        <Slider slidesToShow={2}>
                            {brands.map((item) => (
                                <WhiteBox marginX="auto" width={137} padding="1em 0.5em" key={item.id}>
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
                ) : (
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
                )}
                <Box
                    display="flex"
                    gap="3em"
                    sx={{ marginBottom: { xs: '2em', md: '5em' }, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    <Box display="flex" alignItems="center">
                        <Typography color="text.secondary" variant="body1">
                            <ReactMarkdown content={page.leftSideText}></ReactMarkdown>
                        </Typography>
                    </Box>
                    <Box width={'100%'}>
                        <ReactPlayer width={isMobile ? '100%' : 600} height={300} url={page.videoUrl}></ReactPlayer>
                    </Box>
                </Box>
                <Typography withSeparator component="h2" variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
                    {page.reviewsTitle}
                </Typography>
                <CarouselReviews
                    marginBottom={isMobile ? '3em' : '6em'}
                    data={reviews}
                    slidesToShow={isMobile ? 1 : isTablet ? 2 : 4}></CarouselReviews>
                <Box marginBottom="1em">
                    <Typography
                        fontWeight="bold"
                        maxWidth="500px"
                        withSeparator
                        component="h2"
                        variant={isMobile ? 'h5' : 'h4'}
                        marginBottom="1em">
                        {page.benefitsTitle}
                    </Typography>
                    <Box display="flex" flexDirection={isMobile ? 'column-reverse' : 'initial'}>
                        <Typography flex="1" color="text.secondary" variant="body1">
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
                        fontWeight="bold"
                        withSeparator
                        component="h2"
                        variant={isMobile ? 'h5' : 'h4'}
                        marginBottom="1em">
                        {page.blogTitle}
                    </Typography>
                    <Box
                        padding="0 2.5em"
                        display="flex"
                        flexWrap="wrap"
                        sx={{ flexDirection: { xs: 'column', md: 'initial' }, gap: { xs: '1em', md: '4em' } }}>
                        <Typography
                            sx={{ paddingBottom: { xs: '0.5em', md: '2em' } }}
                            flex="1"
                            color="text.secondary"
                            variant="body1">
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
                            flex="1"
                            color="text.secondary"
                            variant="body1">
                            <ReactMarkdown content={page.blogRightText}></ReactMarkdown>
                        </Typography>
                    </Box>
                    {isTablet ? (
                        <Box marginBottom="1em" paddingX="1em">
                            <Slider slidesToShow={1}>
                                {articles.map((item) => (
                                    <Box paddingX="0.5em" key={item.id}>
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
                        <Box display="flex" gap={'1em'} marginBottom="3.5em">
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
                <Box marginBottom="2em">
                    <Typography
                        fontWeight="bold"
                        withSeparator
                        component="h2"
                        variant={isMobile ? 'h5' : 'h4'}
                        marginBottom="1em">
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
        populate: [
            'seo',
            'benefits',
            'categoryImages',
            'banner',
            'benefitsRightImage',
            'autocomises.image',
            'serviceStations.image'
        ]
    }),
    async () => ({
        articles: (await fetchArticles({ populate: 'image', pagination: { limit: 3 } })).data.data
    }),
    async () => ({
        reviews: (await fetchReviews()).data.data
    }),
    () => ({ hasGlobalContainer: false, hideSEOBox: true })
);
