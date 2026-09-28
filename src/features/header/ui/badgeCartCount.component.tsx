import { Badge } from '@mui/material';
import { reatomComponent } from '@reatom/react';
import { FC } from 'react';
import { useCartStore } from 'entities/cart';

interface BadgeCartCountProps {
	children: React.ReactNode;
}

export const BadgeCartCount = reatomComponent<BadgeCartCountProps>(({ children }) => {
	const cartStore = useCartStore();
	const cartCount = cartStore.items.length;
	return (
		<Badge badgeContent={cartCount} color='error'>
			{children}
		</Badge>
	);
});
