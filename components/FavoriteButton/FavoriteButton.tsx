import { Alert, IconButton } from '@mui/material';
import { useStore } from 'store';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { addToFavorites, removeFromFavorites } from 'api/favorites/favorites';
import { Product } from 'api/types';
import { observer } from 'mobx-react';
import {
	saveFavoriteProductID,
	removeFavoriteProductID,
} from 'services/LocalStorageService';
import { Favorite } from 'api/favorites/types';

interface Props {
	product: Product;
}

const FavoriteButton = ({ product }: Props) => {
	const store = useStore();
	const favorite = store.favorites.items.find(
		(item) => item.product?.id === product.id
	);
	const handleClick = async () => {
		try {
			if (favorite) {
				await store.favorites.removeFavorite(product.id, favorite.id);
				store.notification.showMessage({
					content: (
						<Alert variant='filled'>
							Вы успешно удалили товар из избранного
						</Alert>
					),
				});
			} else {
				await store.favorites.addFavorite(product);
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
