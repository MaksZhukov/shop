import { useFavoriteStore } from 'entities/favorite';
import { FAVORITES_MAX_ITEMS } from 'entities/favorite';
import type { Product } from 'entities/product';
import { useSnackbar } from 'notistack';
import { useAddFavoriteLogic } from './useAddFavoriteLogic';
import { useRemoveFavorite } from './useRemoveFavorite';

export const useToggleFavorite = (product: Product) => {
	const favoriteStore = useFavoriteStore();
	const { enqueueSnackbar } = useSnackbar();
	const addFavorite = useAddFavoriteLogic();
	const removeFavorite = useRemoveFavorite();

	const favorite = favoriteStore.items.find(
		(item) => item.product.id === product.id && item.product.type === product.type
	);
	const isMaxFavorites = favoriteStore.items.length >= FAVORITES_MAX_ITEMS;

	const handleClickFavorite = async () => {
		if (favorite) {
			try {
				await removeFavorite(favorite);
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
				await addFavorite({
					id: new Date().getTime(),
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

	return {
		handleClickFavorite,
		isMaxFavorites,
		favorite
	};
};
