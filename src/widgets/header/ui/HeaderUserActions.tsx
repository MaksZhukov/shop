import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { CartFilledIcon, CartIcon, HeartFilledIcon, HeartIcon } from 'shared/icons';
import { NavbarButton } from 'shared/ui/NavbarButton';
import { BadgeCartCount } from './BadgeCartCount';
import { BadgeFavoritesCount } from './BadgeFavoritesCount';
import Profile from './Profile';

interface HeaderUserActionsProps {
	onClickSignIn: () => void;
	onClickLogout: () => void;
}

export const HeaderUserActions: FC<HeaderUserActionsProps> = ({ onClickSignIn, onClickLogout }) => {
	const router = useRouter();

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
			<Profile onClickSignIn={onClickSignIn} onClickLogout={onClickLogout} />

			<NavbarButton
				variant='link'
				href='/favorites'
				icon={
					<BadgeFavoritesCount>
						{router.pathname.startsWith('/favorites') ? <HeartFilledIcon /> : <HeartIcon />}
					</BadgeFavoritesCount>
				}
				isActive={router.pathname.startsWith('/favorites')}
				sx={{ height: 48, minWidth: 56, px: 1 }}
			>
				Избранное
			</NavbarButton>

			<NavbarButton
				variant='link'
				href='/cart'
				icon={
					<BadgeCartCount>
						{router.pathname.startsWith('/cart') ? <CartFilledIcon /> : <CartIcon />}
					</BadgeCartCount>
				}
				isActive={router.pathname.startsWith('/cart')}
				sx={{ height: 48, minWidth: 56, px: 1 }}
			>
				Корзина
			</NavbarButton>
		</Box>
	);
};
