import { Box, Button, Link, Table, TableBody, TableCell, TableRow, useMediaQuery } from '@mui/material';
import { PageProduct } from 'api/pages/types';
import {
    BrandTextComponent,
    Image as IImage,
    LinkWithImage as ILinkWithImage,
    Product as IProduct,
    ProductType
} from 'api/types';
import classNames from 'classnames';
import CarouselProducts from 'components/CarouselProducts';
import FavoriteButton from 'components/FavoriteButton';
import Image from 'components/Image';
import LinkWithImage from 'components/LinkWithImage';
import ReactMarkdown from 'components/ReactMarkdown';
// import ShoppingCartButton from 'components/ShoppingCartButton';
import WhiteBox from 'components/WhiteBox';
import { FC, useState } from 'react';
import Slider from 'react-slick';
import { isTireBrand, isWheel } from 'services/ProductService';
import styles from './product.module.scss';
import { getStringByTemplateStr } from 'services/StringService';
import { Brand, ProductBrandTexts } from 'api/brands/types';
import Typography from 'components/Typography';

const WHY_WE_BEST = [
    '/product_why_we_best_1.png',
    '/product_why_we_best_2.png',
    '/product_why_we_best_3.png',
    '/product_why_we_best_4.png',
    '/product_why_we_best_5.png',
    '/product_why_we_best_6.png',
    '/product_why_we_best_7.png',
    '/product_why_we_best_8.png'
];

interface Props {
    page: PageProduct & { textAfterDescription: string; textAfterBenefits: string };
    data: IProduct;
    relatedProducts: IProduct[];
    printOptions: { text: string; value?: string | number }[];
}

const Product: FC<Props> = ({ data, printOptions, page, relatedProducts }) => {
    const [sliderBig, setSliderBig] = useState<Slider | null>(null);
    const [sliderSmall, setSliderSmall] = useState<Slider | null>(null);
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    let brandText = isTireBrand(data.brand)
        ? data.brand?.productBrandText?.content
        : data.brand?.productBrandTexts
        ? data.brand?.productBrandTexts[
              Object.keys((data.brand as Brand).productBrandTexts as BrandTextComponent)[1] as keyof ProductBrandTexts
          ]?.content
        : '';

    const getSlidesToShow = () => {
        if (isMobile) {
            return data.images?.length === 1 ? 1 : 2;
        }
        return data.images && data.images.length >= 5 ? 5 : data.images?.length;
    };

    return (
        <>
            <Box display="flex" marginTop="3em" gap={'2em'}>
                <Box display="flex" width="50%" maxHeight={480}>
                    {data.images ? (
                        <>
                            <Slider
                                ref={(ref) => {
                                    setSliderSmall(ref);
                                }}
                                swipeToSlide
                                verticalSwiping
                                vertical
                                arrows={false}
                                slidesToShow={getSlidesToShow()}
                                focusOnSelect
                                className={classNames(styles.slider, styles.slider_small)}
                                asNavFor={sliderBig || undefined}>
                                {data.images.map((item) => (
                                    <Box marginY="0.5em" key={item.id}>
                                        <Image
                                            alt={item.alternativeText}
                                            width={104}
                                            height={78}
                                            src={item.formats?.thumbnail.url || item.url}></Image>
                                    </Box>
                                ))}
                            </Slider>
                            <Slider
                                ref={(ref) => {
                                    setSliderBig(ref);
                                }}
                                asNavFor={sliderSmall || undefined}
                                arrows={false}
                                autoplay
                                autoplaySpeed={5000}
                                className={styles.slider}>
                                {data.images.map((item) => (
                                    <Box paddingX={'1em'} key={item.id}>
                                        <Image
                                            // style={{ height: '100%' }}
                                            alt={item.alternativeText}
                                            width={440}
                                            height={480}
                                            src={item.url}></Image>
                                    </Box>
                                ))}
                            </Slider>
                        </>
                    ) : (
                        <Image
                            alt={data.name}
                            quality={100}
                            width={540}
                            height={480}
                            style={{ objectFit: 'cover' }}
                            src=""></Image>
                    )}
                </Box>
                <Box flex="1">
                    <Typography variant="h4" fontWeight="500" title={data.h1} component="h1">
                        {data.h1}
                    </Typography>
                    <Box marginBottom="1em" alignItems="center" display="flex">
                        <Link marginRight="0.5em" variant="h6" href="tel:+375297804780">
                            +375 29 780 4 780
                        </Link>
                        <FavoriteButton product={data}></FavoriteButton>
                    </Box>
                    <Box display="flex" alignItems="center">
                        {!!data.discountPrice && (
                            <Typography fontWeight="bold" variant="h4" marginRight="0.5em" color="secondary">
                                {data.discountPrice} руб{' '}
                            </Typography>
                        )}
                        {!!data.discountPriceUSD && (
                            <Typography color="text.primary">~{data.discountPriceUSD.toFixed()}$</Typography>
                        )}
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Typography
                            marginRight="0.5em"
                            textAlign="center"
                            fontWeight="bold"
                            variant="h4"
                            component={data.discountPrice ? 's' : 'p'}
                            sx={{ opacity: data.discountPrice ? '0.8' : '1' }}
                            color="secondary">
                            {data.price} руб{' '}
                        </Typography>
                        {!!data.priceUSD && <Typography color="text.secondary">~{data.priceUSD.toFixed()}$</Typography>}
                    </Box>

                    <Table sx={{ marginY: '2em' }}>
                        <TableBody>
                            {printOptions.map((item) => (
                                <TableRow key={item.value}>
                                    <TableCell sx={{ border: 'none', padding: '0.5em 0 0.5em 0' }} padding="none">
                                        <Typography whiteSpace="nowrap" fontWeight="500">
                                            {item.text}
                                        </Typography>
                                    </TableCell>
                                    <TableCell width="100%" sx={{ border: 'none', paddingLeft: '2em' }} padding="none">
                                        <Typography>{item.value}</Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button
                        sx={{ padding: '0.5em 7em', fontSize: '1em' }}
                        variant="contained"
                        component="a"
                        href="tel:+375297804780">
                        Заказать
                    </Button>
                </Box>
            </Box>
            {/* {!!page.linksWithImages?.length && (
                <Box marginTop="2em" display="flex" flexWrap="wrap" justifyContent={'space-around'}>
                    {page.linksWithImages.map((item) => (
                        <LinkWithImage
                            width={110}
                            height={110}
                            key={item.id}
                            image={item.image}
                            link={item.link}></LinkWithImage>
                    ))}
                </Box>
            )} */}
            <Typography withSeparator gutterBottom marginY="1em" component="h2" variant="h5" fontWeight="500">
                {data.h1} характеристики
            </Typography>
            {page.textAfterDescription && <ReactMarkdown content={page.textAfterDescription}></ReactMarkdown>}
            <CarouselProducts
                data={relatedProducts}
                title={
                    <Typography withSeparator fontWeight="500" marginBottom="1em" marginTop="1em" variant="h5">
                        ВАМ СТОИТ ОБРАТИТЬ ВНИМАНИЕ
                    </Typography>
                }></CarouselProducts>
            <Typography
                withSeparator
                textTransform="uppercase"
                fontWeight="500"
                gutterBottom
                component="h3"
                marginBottom="1.5em"
                marginTop="1.5em"
                variant="h5">
                Почему мы лучшие в своем деле?
            </Typography>
            <Box display="flex" justifyContent="space-between" marginBottom="1em" flexWrap="wrap">
                {WHY_WE_BEST.map((url) => (
                    <Image
                        style={{ marginBottom: '2em' }}
                        alt={url}
                        isOnSSR={false}
                        key={url}
                        src={url}
                        width={280}
                        height={185}></Image>
                ))}
            </Box>
            <Typography
                withSeparator
                marginBottom="1.5em"
                textTransform="uppercase"
                fontWeight="500"
                component="h3"
                variant="h5">
                Мы осуществляем доставку во все <br></br> населенные пункты беларуси
            </Typography>
            <Typography>
                Наши Запчасти б/у вы можете заказать с доставкой. Идеальна наша доставка отлажена в следующих городах
                Беларуси - Гродно, Минск, Брест, Гомель, Могилев, Витебск. Так же мы сообщаем что работаем во всех
                городах и деревнях, просто доставка займет немного больше времени. Будьте уверены, мы приложим все силы,
                что бы ваш товар - {data.h1} был доставлен максимально быстро.
            </Typography>
            {brandText && <ReactMarkdown content={brandText}></ReactMarkdown>}
        </>
    );
};

export default Product;
