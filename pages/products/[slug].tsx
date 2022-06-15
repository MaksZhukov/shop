import { Box, Typography } from '@mui/material';
import { Container } from '@mui/system';
import axios from 'axios';
import EmptyImageIcon from 'components/EmptyImageIcon';
import FavoriteButton from 'components/FavoriteButton';
import ShoppingCartButton from 'components/ShoppingCartButton';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import { FC, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { api } from '../../api';
import { fetchProduct } from '../../api/products/products';
import { Product } from '../../api/products/types';
import styles from './product.module.scss';

const { publicRuntimeConfig } = getConfig();

interface Props {
    data: Product;
}

const ProductPage = ({ data }: Props) => {
    return (
        <Container>
            <Box className={styles.product}>
                <Box marginBottom="1em" display="flex" alignItems="center" justifyContent="center">
                    <Typography
                        variant="h4"
                        flex="1"
                        overflow="hidden"
                        title={data.name}
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        component="h1">
                        {data.name}
                    </Typography>
                    <ShoppingCartButton productId={data.id}></ShoppingCartButton>
                    <FavoriteButton productId={data.id}></FavoriteButton>
                </Box>
                <Box display="flex">
                    {data.images ? (
                        <Carousel className={styles.carousel}>
                            {data.images.map((item) => (
                                <Box key={item.id} display="flex" justifyContent="center">
                                    <img alt={data.name} src={publicRuntimeConfig.backendUrl + item.url}></img>
                                </Box>
                            ))}
                        </Carousel>
                    ) : (
                        <EmptyImageIcon size={500}></EmptyImageIcon>
                    )}
                    <Box flex="1" width="200px">
                        <Typography textAlign="right" variant="h5" width="100%" color="primary">
                            {data.price} р.
                        </Typography>
                    </Box>
                </Box>
                <Typography marginTop="1em" color="text.secondary">
                    {data.description}
                </Typography>
            </Box>
        </Container>
    );
};

export const getServerSideProps: GetServerSideProps<{}, { slug: string }> = async (context) => {
    let data = null;
    let notFound = false;
    try {
        const response = await fetchProduct(context.params?.slug || '');
        data = response.data.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            notFound = true;
        }
    }

    return {
        notFound,
        props: { data }
    };
};

export default ProductPage;
