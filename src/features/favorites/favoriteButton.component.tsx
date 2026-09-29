import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import type { Product } from 'entities/product';
import { HeartFilledIcon, FavoriteAddIcon } from 'shared/icons';
import { reatomComponent } from '@reatom/react';
import { FAVORITES_MAX_ITEMS } from 'entities/favorite';
import { useDI } from './favorites.di';

interface FavoriteButtonProps {
	product: Product;
	title?: string;
}

export const FavoriteButton = reatomComponent<FavoriteButtonProps>(({ product, title }) => {
	const { favoriteStore, favoriteListService } = useDI();
	const favorite = favoriteListService.findItem(product);
	const isMaxFavorites = favoriteStore.items.length >= FAVORITES_MAX_ITEMS;
	const handleClickFavorite = () => favoriteListService.toggle(product);

	if (title) {
		const button = (
			<Button disabled={isMaxFavorites} onClick={handleClickFavorite} sx={{ gap: 0.5, px: 0.5 }} size='small'>
				{favorite ? <HeartFilledIcon color='error' /> : <FavoriteAddIcon />}
				<Typography variant='body1' sx={{
                    color: 'text.primary'
                }}>
					{title}
				</Typography>
			</Button>
		);
		return isMaxFavorites ? (
			<Tooltip title={`Достигнут лимит избранного (${FAVORITES_MAX_ITEMS} товаров)`} placement='top'>
				<span>{button}</span>
			</Tooltip>
		) : (
			button
		);
	}
	const iconButton = (
		<IconButton disabled={isMaxFavorites} onClick={handleClickFavorite}>
			{favorite ? <HeartFilledIcon color='error' /> : <FavoriteAddIcon />}
		</IconButton>
	);
	return isMaxFavorites ? (
		<Tooltip title={`Достигнут лимит избранного (${FAVORITES_MAX_ITEMS} товаров)`} placement='top'>
			<span>{iconButton}</span>
		</Tooltip>
	) : (
		iconButton
	);
});
