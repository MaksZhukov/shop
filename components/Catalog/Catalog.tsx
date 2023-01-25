import {
    Button,
    CircularProgress,
    Grid,
    IconButton,
    Input,
    Link,
    MenuItem,
    Pagination,
    PaginationItem,
    Select,
    SelectChangeEvent,
    useMediaQuery
} from '@mui/material';
import { Box } from '@mui/system';
import { useThrottle, useDebounce } from 'rooks';
import { ApiResponse, CollectionParams, LinkWithImage as ILinkWithImage, Product, SEO } from 'api/types';
import { Image as IImage } from 'api/types';
import classNames from 'classnames';
import Filters from 'components/Filters';
import { AutocompleteType, NumberType } from 'components/Filters/types';
import ProductItem from 'components/ProductItem';
import WhiteBox from 'components/WhiteBox';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { ChangeEvent, useEffect, useState, useRef, ReactNode, KeyboardEvent } from 'react';
import styles from './Catalog.module.scss';
import Slider from 'react-slick';
import { Car } from 'api/cars/types';
import Image from 'components/Image';
import NextLink from 'next/link';
import LinkWithImage from 'components/LinkWithImage';
import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import { AxiosResponse } from 'axios';
import { Article } from 'api/articles/types';
import MenuIcon from '@mui/icons-material/MenuSharp';
import GridViewIcon from '@mui/icons-material/GridViewSharp';
import Typography from 'components/Typography';
import { GridViewSharp } from '@mui/icons-material';
import { getProductTypeSlug } from 'services/ProductService';

// const DynamicNews = dynamic(() => import('components/News'));
// const DynamicReviews = dynamic(() => import('components/Reviews'));
const DynamicCarouselProducts = dynamic(() => import('components/CarouselProducts'));
const COUNT_DAYS_FOR_NEW_PRODUCT = 70;

const selectSortItems = [
    { name: 'Новые', value: 'createdAt:desc' },
    { name: 'Старые', value: 'createdAt:asc' },
    { name: 'Дешевые', value: 'price:asc' },
    { name: 'Дорогие', value: 'price:desc' }
];

interface Props {
    seo: SEO | null;
    textTotal?: string;
    newProductsTitle?: string;
    searchPlaceholder?: string;
    cars?: Car[];
    discounts?: ILinkWithImage[];
    advertising?: ILinkWithImage[];
    articles: Article[];
    filtersBtn?: ReactNode;
    serviceStations?: ServiceStation[];
    autocomises?: Autocomis[];
    deliveryAuto?: ILinkWithImage;
    dataFieldsToShow?: { id: string; name: string }[];
    filtersConfig: (AutocompleteType | NumberType)[][];
    generateFiltersByQuery?: (filter: { [key: string]: string }) => any;
    fetchData?: (params: CollectionParams) => Promise<AxiosResponse<ApiResponse<Product[]>>>;
    onClickFind?: (values: { [key: string]: string }) => void;
}

let date = new Date();

const Catalog = ({
    fetchData,
    searchPlaceholder,
    dataFieldsToShow = [],
    filtersConfig,
    generateFiltersByQuery,
    cars = [],
    articles = [],
    discounts = [],
    advertising = [],
    serviceStations = [],
    autocomises = [],
    deliveryAuto,
    seo,
    filtersBtn,
    newProductsTitle,
    textTotal
}: Props) => {
    const [newProducts, setNewProducts] = useState<Product[]>([]);
    const [data, setData] = useState<Product[]>([]);
    const [total, setTotal] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isClickedFind, setIsClickedFind] = useState<boolean>(false);
    const [isFirstDataLoaded, setIsFirstDataLoaded] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [pageCount, setPageCount] = useState<number>(0);
    const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
    const filtersRef = useRef<any>(null);
    const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

    const router = useRouter();

    const { enqueueSnackbar } = useSnackbar();

    const {
        searchValue: querySearchValue = '',
        sort = 'createdAt:desc',
        page = '1',
        ...othersQuery
    } = router.query as {
        searchValue: string;
        sort: string;
        page: string;
        [key: string]: string;
    };

    const [throttledFetchProducts] = useThrottle(async ({ searchValue, ...values }: any, paramPage?: number) => {
        setIsLoading(true);
        if (fetchData) {
            try {
                const {
                    data: {
                        data: responseData,
                        meta: { pagination }
                    }
                } = await fetchData({
                    filters: {
                        price: { $gt: 0 },
                        ...(searchValue ? { h1: { $contains: searchValue } } : {}),
                        ...(generateFiltersByQuery ? generateFiltersByQuery(values) : {})
                    },
                    pagination: searchValue ? {} : { page: paramPage || +page },
                    populate: [...dataFieldsToShow?.map((item) => item.id), 'images'],
                    sort
                });
                setData(responseData);
                if (pagination) {
                    setPageCount(pagination.pageCount);
                    if (paramPage) {
                        router.query.page = '1';
                    } else if (pagination.pageCount < +page) {
                        router.query.page = (pagination.pageCount || 1).toString();
                    }
                    router.push(
                        {
                            pathname: router.pathname,
                            query: router.query
                        },
                        undefined,
                        { shallow: true }
                    );
                    setTotal(pagination.total);
                }
                setIsFirstDataLoaded(true);
            } catch (err) {
                enqueueSnackbar(
                    'Произошла какая-то ошибка при загрузке данных для автозаполнения, обратитесь в поддержку',
                    { variant: 'error' }
                );
            }
        }
        setIsLoading(false);
    }, 300);

    useEffect(() => {
        if (router.isReady) {
            const fetchNewProducts = async () => {
                if (fetchData) {
                    try {
                        const response = await fetchData({
                            sort: 'createdAt:desc',
                            populate: ['images', 'brand'],
                            filters: {
                                price: {
                                    $gt: 0
                                },
                                createdAt: {
                                    $gte: date.setDate(date.getDate() - COUNT_DAYS_FOR_NEW_PRODUCT)
                                }
                            }
                        });
                        setNewProducts(response.data.data);
                    } catch (err) {
                        enqueueSnackbar(
                            'Произошла какая-то ошибка при загрузке новых продуктов, обратитесь в поддержку',
                            {
                                variant: 'error'
                            }
                        );
                    }
                }
            };
            fetchNewProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady]);

    let queryBrand = router.query.brand ? router.query.brand[0] : undefined;

    useEffect(() => {
        if (router.isReady && !isClickedFind) {
            throttledFetchProducts(
                Object.keys(othersQuery).reduce(
                    (prev, key) => ({
                        ...prev,
                        [key]: Array.isArray(othersQuery[key]) ? othersQuery[key][0] : othersQuery[key]
                    }),
                    { searchValue: querySearchValue }
                )
            );
            setSearchValue(querySearchValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, page, queryBrand, router.isReady]);

    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleChangeSort = (e: SelectChangeEvent<HTMLInputElement>) => {
        router.query.sort = e.target.value as string;
        router.push({ pathname: router.pathname, query: router.query });
    };

    const handleClickFind = (values: { [key: string]: string | null }) => {
        let newValues: { [key: string]: string } = { ...values, searchValue };

        let shallow =
            (newValues.brand && router.query.brand && newValues.brand === router.query.brand[0]) ||
            (!newValues.brand && !router.query.brand)
                ? true
                : false;
        Object.keys(newValues).forEach((key) => {
            if (!newValues[key]) {
                delete router.query[key];
            } else {
                router.query[key] = key === 'brand' ? [newValues[key]] : newValues[key];
            }
        });
        throttledFetchProducts(newValues, 1);
        // It needs to avoid the same seo data for the page
        setTimeout(() => {
            router.push({ pathname: router.pathname, query: router.query }, undefined, { shallow: shallow });
            setIsClickedFind(false);
        }, 100);
        setIsClickedFind(true);
    };

    const renderLinkWithImage = (image: IImage, link: string, caption?: string) => (
        <WhiteBox key={image?.id || link} textAlign="center">
            <LinkWithImage image={image} link={link} caption={caption}></LinkWithImage>
        </WhiteBox>
    );

    const renderLinksWithImages = (items?: { image: IImage; link: string; caption?: string }[]) =>
        items?.map((item) => renderLinkWithImage(item.image, item.link, item.caption));

    const handleClickChangeView = (view: 'grid' | 'list', position: 'top' | 'bottom') => () => {
        if (position === 'bottom') {
            window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        }
        setActiveView(view);
    };

    const handleKeyDown = (position: 'top' | 'bottom') => (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            filtersRef.current.onClickFind();
            if (position === 'bottom') {
                window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
            }
        }
    };

    const renderPagination = (
        <Pagination
            sx={{ flex: 1, display: 'flex', justifyContent: 'right' }}
            classes={{}}
            renderItem={(params) => (
                <NextLink
                    shallow
                    href={
                        router.asPath.includes('page=')
                            ? `${router.asPath.replace(/page=\d/, `page=${params.page}`)}`
                            : `${router.asPath}${router.asPath.includes('?') ? '&' : '?'}page=${params.page}`
                    }>
                    <PaginationItem
                        {...params}
                        onClick={() => {
                            window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
                        }}>
                        {params.page}
                    </PaginationItem>
                </NextLink>
            )}
            boundaryCount={1}
            page={+page}
            siblingCount={0}
            color="primary"
            count={pageCount}
            variant="text"
        />
    );

    const renderBar = (position: 'top' | 'bottom') => (
        <Box display="flex" padding="0.5em" marginBottom="1em" bgcolor="#fff">
            <Button
                variant="contained"
                onClick={handleClickChangeView('grid', position)}
                sx={{ bgcolor: activeView === 'grid' ? 'primary.main' : '#000' }}
                className={classNames(styles['btn-view'])}>
                <GridViewIcon fontSize="small" sx={{ color: '#fff' }}></GridViewIcon>
            </Button>
            <Button
                variant="contained"
                sx={{ bgcolor: activeView === 'list' ? 'primary.main' : '#000' }}
                onClick={handleClickChangeView('list', position)}
                className={classNames(styles['btn-view'])}>
                <MenuIcon fontSize="small" sx={{ color: '#fff' }}></MenuIcon>
            </Button>

            <Input
                className={styles['search']}
                sx={{ bgcolor: '#fff', maxWidth: 200, marginRight: '0.5em', paddingLeft: '0.5em' }}
                onChange={handleChangeSearch}
                onKeyDown={handleKeyDown(position)}
                value={searchValue}
                placeholder={searchPlaceholder}></Input>
            <Select
                variant="standard"
                value={sort as any}
                sx={{ maxWidth: 200 }}
                className={styles['sort-select']}
                onChange={handleChangeSort}>
                {selectSortItems.map((item) => (
                    <MenuItem key={item.name} value={item.value}>
                        {item.name}
                    </MenuItem>
                ))}
            </Select>
            {renderPagination}
        </Box>
    );

    return (
        <>
            <Box display="flex" sx={{ flexDirection: { xs: 'column', md: 'initial' } }}>
                <Box marginTop="3.7em" marginRight="1em" component="aside" sx={{ width: { xs: '100%', md: '250px' } }}>
                    <Filters
                        ref={filtersRef}
                        total={total}
                        config={filtersConfig}
                        onClickFind={handleClickFind}></Filters>
                </Box>
                <Box sx={{ width: { md: 'calc(100% - 250px - 2em)' } }}>
                    <Typography marginBottom="0.5em" textTransform="uppercase" component="h1" variant="h4">
                        {seo?.h1}
                    </Typography>
                    {renderBar('top')}
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        justifyContent="space-between"
                        className={classNames({
                            [styles['loading']]: isLoading,
                            [styles['content-items_no-data']]: !data.length
                        })}>
                        {data.length ? (
                            data.map((item) => (
                                <ProductItem
                                    dataFieldsToShow={dataFieldsToShow || []}
                                    activeView={activeView}
                                    key={item.id}
                                    data={item}></ProductItem>
                            ))
                        ) : isFirstDataLoaded && !isLoading ? (
                            <Typography textAlign="center" variant="h5">
                                Данных не найдено
                            </Typography>
                        ) : (
                            <>
                                <CircularProgress></CircularProgress>
                            </>
                        )}
                    </Box>
                    {renderBar('bottom')}
                </Box>
            </Box>
            {!!newProducts.length && (
                <DynamicCarouselProducts
                    data={newProducts}
                    title={
                        <Typography marginBottom="1em" marginTop="1em" textAlign="center" variant="h5">
                            Новые поступления {newProductsTitle}
                        </Typography>
                    }></DynamicCarouselProducts>
            )}
        </>
    );
};

export default Catalog;
