import { Badge } from '@mui/material';
import { FC } from 'react';

interface BadgeCartCountProps {
	children: React.ReactNode;
}

export const BadgeCartCount: FC<BadgeCartCountProps> = ({ children }) => {
	const cartCount = 0;
	return (
		<Badge badgeContent={cartCount} color='error'>
			{children}
		</Badge>
	);
};
