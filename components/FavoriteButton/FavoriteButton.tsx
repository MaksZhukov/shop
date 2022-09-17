import { Alert, IconButton } from '@mui/material';
import { useStore } from 'store';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { Product } from 'api/types';
import { observer } from 'mobx-react';

interface Props {
	product: Product;
}

const FavoriteButton = ({ product }: Props) => {
	const store = useStore();
	const favorite = store.favorites.items.find(
		(item) =>
			item.product.id === product.id && item.product.type === product.type
	);
	const handleClick = async () => {
		try {
			if (favorite) {
				await store.favorites.removeFavorite(favorite);
				store.notification.showMessage({
					content: (
						<Alert variant='filled'>
							Вы успешно удалили товар из избранного
						</Alert>
					),
				});
			} else {
				await store.favorites.addFavorite({
					id: new Date().getTime(),
					product,
				});
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
