import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Button, IconButton, Typography } from '@mui/material';
import { Product } from 'api/types';
import { FavoriteAddedIcon, FavoriteAddIcon } from 'components/Icons';
import { observer } from 'mobx-react';
import { useSnackbar } from 'notistack';
import { useStore } from 'store';

interface Props {
	product: Product;
	title: string;
}

const FavoriteButton = ({ product, title }: Props) => {
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
	if (title) {
		return (
			<Button onClick={handleClick} sx={{ gap: 0.5, px: 0.5 }} size='small'>
				{favorite ? <FavoriteAddedIcon /> : <FavoriteAddIcon />}
				<Typography variant='body1' color='text.primary'>
					{title}
				</Typography>
			</Button>
		);
	}
	return <IconButton onClick={handleClick}>{favorite ? <FavoriteAddedIcon /> : <FavoriteAddIcon />}</IconButton>;
};

export default observer(FavoriteButton);
