import { Badge } from '@mui/material';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { useStore } from 'store';

interface BadgeCartCountProps {
	children: React.ReactNode;
}

export const BadgeCartCount: FC<BadgeCartCountProps> = observer(({ children }) => {
	const store = useStore();
	const cartCount = store.shoppingCart.items.length;
	return (
		<Badge badgeContent={cartCount} color='error'>
			{children}
		</Badge>
	);
});
