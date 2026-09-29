import { Box, IconButton } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { CartFilledIcon, CartIcon, HeartFilledIcon, HeartIcon } from 'shared/icons';
import { BadgeCartCount } from './badgeCartCount.component';
import { BadgeFavoritesCount } from './badgeFavoritesCount.component';
import { ProfileButton } from './profileButton.component';

export const HeaderMobileUserActions: FC = () => {
	const router = useRouter();

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
			<ProfileButton iconOnly />

			<IconButton
				component={NextLink}
				href='/favorites'
				aria-label='Избранное'
				sx={{ p: 0.75, color: 'custom.text-muted' }}
			>
				<BadgeFavoritesCount>
					{router.pathname.startsWith('/favorites') ? <HeartFilledIcon /> : <HeartIcon />}
				</BadgeFavoritesCount>
			</IconButton>

			<IconButton
				component={NextLink}
				href='/cart'
				aria-label='Корзина'
				sx={{ p: 0.75, color: 'custom.text-muted' }}
			>
				<BadgeCartCount>
					{router.pathname.startsWith('/cart') ? <CartFilledIcon /> : <CartIcon />}
				</BadgeCartCount>
			</IconButton>
		</Box>
	);
};
