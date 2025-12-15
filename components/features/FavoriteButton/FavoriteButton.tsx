import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import { Product } from 'api/types';
import { HeartFilledIcon, FavoriteAddIcon } from 'shared/icons';
import { observer } from 'mobx-react';
import { useSnackbar } from 'notistack';
import { useStore } from 'store';
import { API_MAX_FAVORITES_ITEMS } from 'api/constants';

interface Props {
	product: Product;
	title?: string;
}

const FavoriteButton = ({ product, title }: Props) => {
	const store = useStore();
	const { enqueueSnackbar } = useSnackbar();
	const favorite = store.favorites.items.find(
		(item) => item.product.id === product.id && item.product.type === product.type
	);
	const isMaxFavorites = store.favorites.items.length >= API_MAX_FAVORITES_ITEMS;
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
		const button = (
			<Button disabled={isMaxFavorites} onClick={handleClick} sx={{ gap: 0.5, px: 0.5 }} size='small'>
				{favorite ? <HeartFilledIcon color='error' /> : <FavoriteAddIcon />}
				<Typography variant='body1' color='text.primary'>
					{title}
				</Typography>
			</Button>
		);
		return isMaxFavorites ? (
			<Tooltip title={`Достигнут лимит избранного (${API_MAX_FAVORITES_ITEMS} товаров)`} placement='top'>
				<span>{button}</span>
			</Tooltip>
		) : (
			button
		);
	}
	const iconButton = (
		<IconButton disabled={isMaxFavorites} onClick={handleClick}>
			{favorite ? <HeartFilledIcon color='error' /> : <FavoriteAddIcon />}
		</IconButton>
	);
	return isMaxFavorites ? (
		<Tooltip title={`Достигнут лимит избранного (${API_MAX_FAVORITES_ITEMS} товаров)`} placement='top'>
			<span>{iconButton}</span>
		</Tooltip>
	) : (
		iconButton
	);
};

export default observer(FavoriteButton);
