import { Card, CardContent, Button, Link, Grid, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { Product } from '../../api/types';
import styles from './ProductItem.module.scss';
// import ShoppingCartButton from 'components/ShoppingCartButton';
import FavoriteButton from 'components/FavoriteButton';
import Typography from 'components/Typography';
import NextLink from 'next/link';
import Slider from 'react-slick';
import classNames from 'classnames';
import Image from 'components/Image';
import { getProductTypeSlug } from 'services/ProductService';

interface Props {
    dataFieldsToShow: { id: string; name: string }[];
    activeView: 'grid' | 'list';
    data: Product;
}

const ProductItem = ({ data, dataFieldsToShow, activeView }: Props) => {
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

    const renderContentByView = {
        list: (
            <Box padding="0.5em 1em" display="flex" flexDirection="column">
                <NextLink href={`/${getProductTypeSlug(data)}/` + data.slug}>
                    <Link
                        variant="h6"
                        alignItems="center"
                        sx={{ color: '#000' }}
                        color="secondary"
                        component="span"
                        underline="hover"
                        fontWeight="500">
                        {data.name}
                    </Link>
                </NextLink>
                <Grid columnSpacing={2} container>
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
                {' '}
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
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
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
            height={activeView === 'grid' ? 350 : 150}
            bgcolor="#fff"
            key={data.id}
            display={activeView === 'list' ? 'flex' : 'initial'}
            width={activeView === 'grid' ? 280 : '100%'}>
            {data.images ? (
                <Box width={activeView === 'list' ? 200 : '100%'}>
                    <Slider autoplay autoplaySpeed={5000} arrows={false}>
                        {data.images?.map((image) => (
                            <Image
                                key={image.id}
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
                        style={{ height: '100%' }}
                        src=""
                        width={activeView === 'grid' ? 280 : 200}
                        height={activeView === 'grid' ? 215 : 150}
                        alt={data.name}></Image>
                </Box>
            )}
            {renderContentByView[activeView]}
        </Box>
    );
};

export default ProductItem;
