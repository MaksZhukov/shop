import { Badge } from '@mui/material';
import { reatomComponent } from '@reatom/react';
import { FC } from 'react';
import { useFavoriteStore } from 'entities/favorite';

interface BadgeFavoritesCountProps {
	children: React.ReactNode;
}

export const BadgeFavoritesCount = reatomComponent<BadgeFavoritesCountProps>(({ children }) => {
	const favoriteStore = useFavoriteStore();
	const favoritesCount = favoriteStore.items.length;

	return (
		<Badge badgeContent={favoritesCount} color='error'>
			{children}
		</Badge>
	);
});
