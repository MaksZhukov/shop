import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import type { Product } from 'entities/product';
import { HeartFilledIcon, FavoriteAddIcon } from 'shared/icons';
import { observer } from 'mobx-react';
import { FAVORITES_MAX_ITEMS } from 'entities/favorite';
import { useToggleFavorite } from './useToggleFavorite';
import { FC } from 'react';

interface FavoriteButtonProps {
	product: Product;
	title?: string;
}

export const FavoriteButton: FC<FavoriteButtonProps> = observer(({ product, title }) => {
	const { handleClickFavorite, isMaxFavorites, favorite } = useToggleFavorite(product);

	if (title) {
		const button = (
			<Button disabled={isMaxFavorites} onClick={handleClickFavorite} sx={{ gap: 0.5, px: 0.5 }} size='small'>
				{favorite ? <HeartFilledIcon color='error' /> : <FavoriteAddIcon />}
				<Typography variant='body1' color='text.primary'>
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
