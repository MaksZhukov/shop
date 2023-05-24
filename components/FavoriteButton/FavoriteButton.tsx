import { Alert, IconButton } from '@mui/material';
import { useStore } from 'store';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Product } from 'api/types';
import { observer } from 'mobx-react';
import { useSnackbar } from 'notistack';

interface Props {
    product: Product;
}

const FavoriteButton = ({ product }: Props) => {
    const store = useStore();
    const { enqueueSnackbar } = useSnackbar();
    const favorite = store.favorites.items.find(
        (item) => item.product.id === product.id && item.product.type === product.type
    );
    const handleClick = async () => {
        if (favorite) {
            try {
                await store.favorites.removeFavorite(favorite);
                enqueueSnackbar('Вы успешно удалили товар из избранного', {
                    variant: 'success'
                });
            } catch (err) {
                enqueueSnackbar('Произошла какая-то ошибка с удалением избранного, обратитесь в поддержку', {
                    variant: 'error'
                });
            }
        } else {
            try {
                await store.favorites.addFavorite({
                    id: new Date().getTime(),
                    uid: new Date().getTime().toString(),
                    product
                });
                enqueueSnackbar('Вы успешно добавили товар в избранное', {
                    variant: 'success'
                });
            } catch (err) {
                enqueueSnackbar('Произошла какая-то ошибка с добавлением избранного, обратитесь в поддержку', {
                    variant: 'error'
                });
            }
        }
    };
    return (
        <IconButton onClick={handleClick}>
            {favorite ? (
                <FavoriteIcon titleAccess='Удалить избранное' color='primary'></FavoriteIcon>
            ) : (
                <FavoriteBorderIcon titleAccess='Добавить в избранное' color='primary'></FavoriteBorderIcon>
            )}
        </IconButton>
    );
};

export default observer(FavoriteButton);
