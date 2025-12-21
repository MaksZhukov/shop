import { Badge } from '@mui/material';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { useCartStore } from 'entities/cart';

interface BadgeCartCountProps {
	children: React.ReactNode;
}

export const BadgeCartCount: FC<BadgeCartCountProps> = observer(({ children }) => {
	const cartStore = useCartStore();
	const cartCount = cartStore.items.length;
	return (
		<Badge badgeContent={cartCount} color='error'>
			{children}
		</Badge>
	);
});
