import { Alert, IconButton } from '@mui/material';
import { useStore } from 'store';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
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
		(item) =>
			item.product.id === product.id && item.product.type === product.type
	);
	const handleClick = async () => {
		if (favorite) {
			try {
				await store.favorites.removeFavorite(favorite);
				enqueueSnackbar('Вы успешно удалили товар из избранного', {
					variant: 'success',
				});
			} catch (err) {
				enqueueSnackbar(
					'Произошла какая-то ошибка с удалением избранного, обратитесь в поддержку',
					{ variant: 'error' }
				);
			}
		} else {
			try {
				await store.favorites.addFavorite({
					id: new Date().getTime(),
					uid: new Date().getTime().toString(),
					product,
				});
				enqueueSnackbar('Вы успешно добавили товар в избранное', {
					variant: 'success',
				});
			} catch (err) {
				enqueueSnackbar(
					'Произошла какая-то ошибка с добавлением избранного, обратитесь в поддержку',
					{ variant: 'error' }
				);
			}
		}
	};
	return (
		<IconButton onClick={handleClick}>
			{favorite ? (
				<StarIcon color='primary'></StarIcon>
			) : (
				<StarOutlineIcon color='primary'></StarOutlineIcon>
			)}
		</IconButton>
	);
};

export default observer(FavoriteButton);
