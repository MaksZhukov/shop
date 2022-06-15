import { Alert, IconButton } from '@mui/material';
import { useStore } from 'store';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { addToFavorites, removeFromFavorites } from 'api/favorites/favorites';
import { observer } from 'mobx-react';

interface Props {
	productId: number;
}

const FavoriteButton = ({ productId }: Props) => {
	const store = useStore();
	const favorite = store.favorites.items.find(
		(item) => item.product?.id === productId
	);
	const handleClick = async () => {
		try {
			if (favorite) {
				await removeFromFavorites(favorite.id);
				store.favorites.removeFavorite(favorite.id);
				store.notification.showMessage({
					content: (
						<Alert variant='filled'>
							Вы успешно удалили товар из избранного
						</Alert>
					),
				});
			} else {
				let {
					data: { data: favorite },
				} = await addToFavorites(productId);
				store.favorites.addFavorite(favorite);
				store.notification.showMessage({
					content: (
						<Alert variant='filled'>
							Вы успешно добавили товар в избранное
						</Alert>
					),
				});
			}
		} catch (err) {}
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
