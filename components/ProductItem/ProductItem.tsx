import { Card, CardContent, CardMedia, IconButton, Button, Link } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { Product } from '../../api/products/types';
import styles from './ProductItem.module.scss';
import getConfig from 'next/config';
import ShoppingCartButton from 'components/ShoppingCartButton';
import FavoriteButton from 'components/FavoriteButton';
import EmptyImageIcon from 'components/EmptyImageIcon';
import Typography from 'components/Typography';

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
                        component="img"
                        image={thumbnailUrl}
                        sx={{ width: 200, cursor: 'pointer' }}
                        alt={'Product ' + data.name}
                    />
                ) : (
                    <EmptyImageIcon size={200} cursor="pointer"></EmptyImageIcon>
                )}
                <CardContent sx={{ flex: 1, paddingBottom: '0!important' }}>
                    <Typography
                        onClick={handleClickMore(data.slug)}
                        lineClamp={1}
                        title={data.name}
                        component="div"
                        marginBottom="0.5em"
                        variant="h5">
                        <Link underline="hover">{data.name}</Link>
                    </Typography>
                    <Typography lineClamp={4} variant="body1" color="text.secondary">
                        {data.description}
                    </Typography>
                </CardContent>
            </Box>

            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography flex="1" fontWeight="bold" variant="body1" color="primary">
                    Цена: {data.price} руб{' '}
                    {data.priceUSD && (
                        <Typography color="text.secondary" component="sup">
                            (~{data.priceUSD.toFixed()}$)
                        </Typography>
                    )}
                </Typography>
                <Button onClick={handleClickMore(data.slug)} variant="outlined">
                    Подробнее
                </Button>
                <FavoriteButton product={data}></FavoriteButton>
                <ShoppingCartButton product={data}></ShoppingCartButton>
            </CardContent>
        </Card>
    );
};

export default ProductItem;
