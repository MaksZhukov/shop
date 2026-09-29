import { Badge } from '@mui/material';
import { reatomComponent } from '@reatom/react';
import { FC } from 'react';
import { useDI } from '../../header.di';

interface BadgeFavoritesCountProps {
	children: React.ReactNode;
}

export const BadgeFavoritesCount = reatomComponent<BadgeFavoritesCountProps>(({ children }) => {
	const { favoriteStore } = useDI();
	const favoritesCount = favoriteStore.items.length;

	return (
		<Badge badgeContent={favoritesCount} color='error'>
			{children}
		</Badge>
	);
});
