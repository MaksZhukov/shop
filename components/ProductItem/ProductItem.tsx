import { Card, CardContent, CardMedia, IconButton, Typography, Button, Alert } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { Product } from '../../api/products/types';
import styles from './ProductItem.module.scss';
import getConfig from 'next/config';
import ShoppingCartButton from 'components/ShoppingCartButton';
import FavoriteButton from 'components/FavoriteButton';
import EmptyImageIcon from 'components/EmptyImageIcon';

const { publicRuntimeConfig } = getConfig();

interface Props {
    data: Product;
}

const ProductItem = ({ data }: Props) => {
    const router = useRouter();

    let thumbnailUrl = data.images ? publicRuntimeConfig.backendUrl + data.images[0].formats.thumbnail.url : null;

    const handleClickMore = (slug: string) => () => {
        router.push('/products/' + slug);
    };

    return (
        <Card sx={{ marginBottom: '2em' }} className={styles.product}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                {thumbnailUrl ? (
                    <CardMedia
                        onClick={handleClickMore(data.slug)}
                        component="img"
                        image={thumbnailUrl}
                        sx={{ width: 200, cursor: 'pointer' }}
                        alt={'Product ' + data.name}
                    />
                ) : (
                    <EmptyImageIcon size={200} cursor="pointer" onClick={handleClickMore(data.slug)}></EmptyImageIcon>
                )}
                <CardContent sx={{ flex: 1, paddingBottom: '0!important' }}>
                    <Typography
                        title={data.name}
                        className={styles.name}
                        component="div"
                        marginBottom="0.5em"
                        variant="h5">
                        {data.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" className={styles.description}>
                        {data.description}
                    </Typography>
                </CardContent>
            </Box>

            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography flex="1" fontWeight="bold" variant="body1" color="primary">
                    Цена: {data.price} руб.
                </Typography>
                <Button onClick={handleClickMore(data.slug)} variant="outlined">
                    Подробнее
                </Button>
                <FavoriteButton productId={data.id}></FavoriteButton>
                <ShoppingCartButton productId={data.id}></ShoppingCartButton>
            </CardContent>
        </Card>
    );
};

export default ProductItem;
