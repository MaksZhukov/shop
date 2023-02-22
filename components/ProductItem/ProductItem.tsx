import { Card, CardContent, Button, Link, Grid, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { Product } from '../../api/types';
import styles from './ProductItem.module.scss';
// import ShoppingCartButton from 'components/ShoppingCartButton';
import FavoriteButton from 'components/FavoriteButton';
import Typography from 'components/Typography';
import NextLink from 'next/link';
import Slider from 'react-slick';
import Image from 'components/Image';
import { getProductTypeSlug } from 'services/ProductService';

interface Props {
    dataFieldsToShow?: { id: string; name: string }[];
    activeView?: 'grid' | 'list';
    data: Product;
    width?: number | string;
    minHeight?: number | string;
}

const ProductItem = ({
    data,
    dataFieldsToShow = [],
    activeView = 'grid',
    width = '100%',
    minHeight = 'auto'
}: Props) => {
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    const renderContentByView = {
        list: (
            <Box
                padding="0.5em 1em"
                display="flex"
                flexDirection="column"
                width={{ xs: 'calc(100% - 150px)', sm: 'initial' }}>
                <NextLink href={`/${getProductTypeSlug(data)}/` + data.slug}>
                    <Link
                        typography={'h6'}
                        alignItems="center"
                        sx={{
                            color: '#000',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        color="secondary"
                        component="span"
                        underline="hover"
                        fontWeight="500">
                        {data.name}
                    </Link>
                </NextLink>
                <Grid sx={{ display: { xs: 'none', md: 'flex' } }} columnSpacing={2} container>
                    {dataFieldsToShow.map((item) => (
                        <Grid key={item.id} item>
                            <Typography fontWeight="500" component="div" variant="subtitle1">
                                {item.name}
                            </Typography>
                            {typeof data[item.id as keyof Product] === 'object' &&
                            data[item.id as keyof Product] !== null
                                ? //@ts-ignore
                                  data[item.id as keyof Product]['name']
                                : data[item.id as keyof Product]}
                        </Grid>
                    ))}
                </Grid>
                <Box display="flex" marginTop="0.5em">
                    {!!data.discountPrice && (
                        <Typography fontWeight="bold" variant="h5" marginRight="0.5em" color="secondary">
                            {data.discountPrice} руб{' '}
                        </Typography>
                    )}
                    {!!data.discountPriceUSD && (
                        <Typography marginRight="1em" color="text.primary">
                            ~{data.discountPriceUSD.toFixed()}$
                        </Typography>
                    )}

                    <Typography
                        marginRight="0.5em"
                        textAlign="center"
                        fontWeight="bold"
                        variant="h5"
                        component={data.discountPrice ? 's' : 'p'}
                        sx={{ opacity: data.discountPrice ? '0.8' : '1' }}
                        color="secondary">
                        {data.price} руб{' '}
                    </Typography>
                    {!!data.priceUSD && <Typography color="text.secondary">~{data.priceUSD.toFixed()}$</Typography>}
                </Box>
            </Box>
        ),
        grid: (
            <>
                <NextLink href={`/${getProductTypeSlug(data)}/` + data.slug}>
                    <Link
                        height={60}
                        variant="body2"
                        display="flex"
                        alignItems="center"
                        sx={{ color: '#000' }}
                        justifyContent="center"
                        color="secondary"
                        component="span"
                        underline="hover"
                        fontWeight="500"
                        padding="0.25em"
                        marginTop="0.5em"
                        textAlign="center">
                        {data.name}
                    </Link>
                </NextLink>
                <Box display="flex" height={65} flexDirection="column" alignItems="center" justifyContent="center">
                    <Box display="flex" alignItems="center">
                        {!!data.discountPrice && (
                            <Typography
                                paddingLeft="0.5em"
                                fontWeight="bold"
                                variant="h5"
                                marginRight="0.5em"
                                color="secondary">
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
                            variant="h5"
                            component={data.discountPrice ? 's' : 'p'}
                            sx={{ opacity: data.discountPrice ? '0.8' : '1' }}
                            color="secondary">
                            {data.price} руб{' '}
                        </Typography>
                        {!!data.priceUSD && <Typography color="text.secondary">~{data.priceUSD.toFixed()}$</Typography>}
                    </Box>
                </Box>
            </>
        )
    };
    return (
        <Box
            marginBottom="1em"
            minHeight={minHeight}
            bgcolor="#fff"
            key={data.id}
            display={activeView === 'list' ? 'flex' : 'initial'}
            width={width}>
            {data.images ? (
                <Box width={activeView === 'list' ? (isMobile ? 150 : 200) : '100%'}>
                    <Slider autoplay autoplaySpeed={5000} arrows={false}>
                        {data.images?.map((image) => (
                            <Image
                                key={image.id}
                                title={image.caption}
                                width={activeView === 'grid' ? 280 : 200}
                                height={activeView === 'grid' ? 215 : 150}
                                alt={image.alternativeText}
                                src={image.url}></Image>
                        ))}
                    </Slider>
                </Box>
            ) : (
                <Box>
                    <Image
                        title={data.name}
                        style={{ objectFit: 'cover', maxWidth: '100%', margin: 'auto' }}
                        src=""
                        width={activeView === 'grid' ? 280 : isMobile ? 150 : 200}
                        height={activeView === 'grid' ? 215 : 150}
                        alt={data.name}></Image>
                </Box>
            )}
            {renderContentByView[activeView]}
        </Box>
    );
};

export default ProductItem;
