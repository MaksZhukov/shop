import {
    Alert,
    Container,
    Input,
    Link,
    MenuItem,
    Pagination,
    Select,
    SelectChangeEvent,
    useMediaQuery,
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
import { ChangeEvent, useEffect, useState, useRef, ReactNode } from 'react';
import styles from './Catalog.module.scss';
import Slider from 'react-slick';
import { Car } from 'api/cars/types';
import Image from 'components/Image';
import NextLink from 'next/link';
import LinkWithImage from 'components/LinkWithImage';
import { Filters as IFilters } from 'api/types';
import { OneNews } from 'api/news/types';
import getConfig from 'next/config';
import Typography from 'components/Typography';
import SEOBox from 'components/SEOBox';
import HeadSEO from 'components/HeadSEO';
import { Autocomis } from 'api/autocomises/types';
import { ServiceStation } from 'api/serviceStations/types';
import { AxiosResponse } from 'axios';
import { Article } from 'api/articles/types';
const { publicRuntimeConfig } = getConfig();

// const DynamicNews = dynamic(() => import('components/News'));
// const DynamicReviews = dynamic(() => import('components/Reviews'));
const DynamicCarouselProducts = dynamic(() => import('components/CarouselProducts'));
const COUNT_DAYS_FOR_NEW_PRODUCT = 70;

const selectSortItems = [
    { name: 'Новые', value: 'createdAt:desc' },
    { name: 'Старые', value: 'createdAt:asc' },
    { name: 'Дешевые', value: 'price:asc' },
    { name: 'Дорогие', value: 'price:desc' },
];

interface Props {
    seo: SEO | null;
    textTotal?: string;
    newProductsTitle?: string;
    searchPlaceholder?: string;
    cars: Car[];
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
    middleContent?: ReactNode;
}

let date = new Date();

const Catalog = ({
    fetchData,
    searchPlaceholder,
    dataFieldsToShow,
    filtersConfig,
    generateFiltersByQuery,
    cars = [],
    articles = [],
    discounts = [],
    advertising = [],
    serviceStations = [],
    autocomises = [],
    deliveryAuto,
    middleContent,
    seo,
    filtersBtn,
    newProductsTitle,
    textTotal,
}: Props) => {
    const [newProducts, setNewProducts] = useState<Product[]>([]);
    const [data, setData] = useState<Product[]>([]);
    const [total, setTotal] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFirstDataLoaded, setIsFirstDataLoaded] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [pageCount, setPageCount] = useState<number>(0);
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

    const [throttledFetchProducts] = useThrottle(async () => {
        setIsLoading(true);
        if (fetchData) {
            try {
                const {
                    data: {
                        data: responseData,
                        meta: { pagination },
                    },
                } = await fetchData({
                    filters: {
                        ...(searchValue
                            ? {
                                  $or: [{ name: { $contains: searchValue } }, { h1: { $contains: searchValue } }],
                              }
                            : {}),
                        ...(generateFiltersByQuery ? generateFiltersByQuery(othersQuery) : {}),
                    },
                    pagination: searchValue ? {} : { page: +page },
                    populate: '*',
                    sort,
                });
                setData(responseData);
                if (pagination) {
                    setPageCount(pagination.pageCount);
                    if (pagination.pageCount < +page) {
                        router.query.page = (pagination.pageCount || 1).toString();
                        router.push(
                            {
                                pathname: router.pathname,
                                query: router.query,
                            },
                            undefined,
                            { shallow: true }
                        );
                    }
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
        const fetchNewProducts = async () => {
            if (fetchData) {
                try {
                    const response = await fetchData({
                        sort: 'createdAt:desc',
                        populate: ['images'],
                        filters: {
                            createdAt: {
                                $gte: date.setDate(date.getDate() - COUNT_DAYS_FOR_NEW_PRODUCT),
                            },
                        },
                    });
                    setNewProducts(response.data.data);
                } catch (err) {
                    enqueueSnackbar('Произошла какая-то ошибка при загрузке новых продуктов, обратитесь в поддержку', {
                        variant: 'error',
                    });
                }
            }
        };
        fetchNewProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeRouterQuery = useRef((field: string, value: string) => {
        router.query[field] = value;
        router.replace(
            { pathname: router.pathname, query: router.query },
            undefined,

            { shallow: true }
        );
    });

    const debouncedChangeRouterQuery = useDebounce(changeRouterQuery.current, 300);

    useEffect(() => {
        if (router.isReady) {
            throttledFetchProducts();
            setSearchValue(querySearchValue);
        }
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, page, router.isReady]);

    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        debouncedChangeRouterQuery('searchValue', e.target.value);
    };

    const handleChangeSort = (e: SelectChangeEvent<HTMLInputElement>) => {
        router.query.sort = e.target.value as string;
        router.push({ pathname: router.pathname, query: router.query });
    };

    const handleChangePage = (_: any, newPage: number) => {
        router.query.page = newPage.toString();
        router.push({ pathname: router.pathname, query: router.query }, undefined, {
            shallow: true,
        });
    };

    const renderLinkWithImage = (image: IImage, link: string) => (
        <WhiteBox key={image.id} textAlign="center">
            <LinkWithImage image={image} link={link}></LinkWithImage>
        </WhiteBox>
    );

    const renderLinksWithImages = (items?: { image: IImage; link: string }[]) =>
        items?.map((item) => renderLinkWithImage(item.image, item.link));

    return (
        <>
            <HeadSEO title={seo?.title} description={seo?.description} keywords={seo?.keywords}></HeadSEO>
            <Container>
                <WhiteBox>
                    <Typography textTransform="capitalize" component="h1" variant="h4" textAlign="center">
                        {seo?.h1}
                    </Typography>
                </WhiteBox>
                <Box className={classNames(styles.wrapper, isTablet && styles.wrapper_tablet)}>
                    <Box
                        marginRight="1em"
                        component="aside"
                        className={classNames(styles.sider, styles.sider_left, isTablet && styles.sider_tablet)}
                    >
                        <Filters
                            textTotal={textTotal ? textTotal : total ? `Найдено: ${total}` : undefined}
                            btn={filtersBtn}
                            config={filtersConfig}
                            total={total}
                            fetchData={throttledFetchProducts}
                        ></Filters>
                        {renderLinksWithImages(
                            serviceStations.map((item) => ({
                                image: item.image,
                                link: `/service-stations/${item.slug}`,
                            }))
                        )}
                        {renderLinksWithImages(
                            autocomises.map((item) => ({
                                image: item.image,
                                link: `/autocomises/${item.slug}`,
                            }))
                        )}
                        {deliveryAuto && renderLinkWithImage(deliveryAuto.image, deliveryAuto.link)}
                    </Box>
                    <Box
                        marginRight="1em"
                        width="calc(100% - 500px - 2em)"
                        // className={classNames(
                        // 	styles.content,
                        // 	isTablet && styles.content_tablet
                        // )}
                    >
                        {middleContent ? (
                            middleContent
                        ) : (
                            <>
                                <WhiteBox display="flex">
                                    <Input
                                        className={styles['search']}
                                        onChange={handleChangeSearch}
                                        value={searchValue}
                                        placeholder={searchPlaceholder}
                                        fullWidth
                                    ></Input>
                                    <Select
                                        variant="standard"
                                        value={sort as any}
                                        fullWidth
                                        className={styles['sort-select']}
                                        onChange={handleChangeSort}
                                    >
                                        {selectSortItems.map((item) => (
                                            <MenuItem key={item.name} value={item.value}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </WhiteBox>
                                <WhiteBox
                                    className={classNames({
                                        [styles['loading']]: isLoading,
                                        [styles['content-items_no-data']]: !data.length,
                                    })}
                                >
                                    {data.length ? (
                                        data.map((item) => (
                                            <ProductItem
                                                dataFieldsToShow={dataFieldsToShow || []}
                                                key={item.id}
                                                data={item}
                                            ></ProductItem>
                                        ))
                                    ) : isFirstDataLoaded && !isLoading ? (
                                        <Typography textAlign="center" variant="h5">
                                            Данных не найдено
                                        </Typography>
                                    ) : (
                                        <></>
                                    )}
                                </WhiteBox>
                                {pageCount > 1 && (
                                    <WhiteBox display="flex" justifyContent="center">
                                        <Pagination
                                            page={+page}
                                            siblingCount={2}
                                            color="primary"
                                            count={pageCount}
                                            onChange={handleChangePage}
                                            variant="outlined"
                                        />
                                    </WhiteBox>
                                )}
                            </>
                        )}
                    </Box>

                    <Box className={styles['sider-right']}>
                        {!!cars.length && (
                            <WhiteBox padding="1em 1.5em">
                                <Slider swipe={false}>
                                    {cars
                                        .filter((item) => item.images)
                                        .map((item) => (
                                            <Slider arrows={false} key={item.id} autoplay autoplaySpeed={3000}>
                                                {item.images?.map((image) => (
                                                    <Image
                                                        alt={image.alternativeText}
                                                        key={image.id}
                                                        width={208}
                                                        height={156}
                                                        src={image.formats?.thumbnail.url || image.url}
                                                    ></Image>
                                                ))}
                                            </Slider>
                                        ))}
                                </Slider>
                            </WhiteBox>
                        )}
                        {renderLinksWithImages(discounts)}
                        {renderLinksWithImages(advertising)}
                        {!!articles.length && (
                            <WhiteBox padding="1em 1.5em">
                                <Slider autoplay autoplaySpeed={3000}>
                                    {articles.map((item) => (
                                        <Box key={item.id}>
                                            <NextLink href={`/articles/${item.slug}`}>
                                                <Link component="span" underline="hover">
                                                    <Typography marginBottom="0.5em" lineClamp={2}>
                                                        {item.name}
                                                    </Typography>
                                                </Link>
                                            </NextLink>
                                            <Image
                                                alt={item.image.alternativeText}
                                                width={208}
                                                height={156}
                                                src={item.image?.formats?.thumbnail.url || item.image.url}
                                            ></Image>
                                            <Typography textAlign="right" color="text.secondary">
                                                {new Date(item.createdAt).toLocaleDateString('ru-RU')}{' '}
                                                {new Date(item.createdAt).toLocaleTimeString('ru-RU', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Slider>
                            </WhiteBox>
                        )}
                    </Box>
                </Box>
                {!!newProducts.length && (
                    <DynamicCarouselProducts
                        data={newProducts}
                        title={
                            <Typography marginBottom="1em" marginTop="1em" textAlign="center" variant="h5">
                                Новые {newProductsTitle}
                            </Typography>
                        }
                    ></DynamicCarouselProducts>
                )}
                <SEOBox images={seo?.images} content={seo?.content}></SEOBox>
            </Container>
        </>
    );
};

export default Catalog;
