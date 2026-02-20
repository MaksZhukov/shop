import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import {
	CartIcon,
	CartFilledIcon,
	DashboardFilledIcon,
	DashboardIcon,
	HeartIcon,
	HeartFilledIcon,
	HomeFilledIcon,
	HomeIcon
} from 'shared/icons';
import { NavbarButton } from 'shared/ui/NavbarButton';
import Profile from './Profile';
import { BadgeCartCount } from './BadgeCartCount';

interface MobileBottomNavProps {
	onClickSignIn: () => void;
	onClickLogout: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onClickSignIn, onClickLogout }) => {
	const router = useRouter();

	return (
		<Box
			sx={{
				display: { xs: 'flex', md: 'none' },
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 3,
				bgcolor: 'custom.bg-surface-1',
				borderTop: 1,
				borderColor: 'divider',
				padding: 1,
				justifyContent: 'space-around',
				alignItems: 'center'
			}}
		>
			<NavbarButton
				href='/'
				variant='link'
				icon={router.pathname === '/' ? <HomeFilledIcon /> : <HomeIcon />}
				isActive={router.pathname === '/'}
			>
				Главная
			</NavbarButton>

			<NavbarButton
				href='/mobile-catalog'
				variant='link'
				icon={router.pathname.startsWith('/mobile-catalog') ? <DashboardFilledIcon /> : <DashboardIcon />}
				isActive={router.pathname.startsWith('/mobile-catalog')}
			>
				Каталог
			</NavbarButton>

			<Profile onClickSignIn={onClickSignIn} onClickLogout={onClickLogout} />

			<NavbarButton
				href='/favorites'
				variant='link'
				icon={router.pathname.startsWith('/favorites') ? <HeartFilledIcon /> : <HeartIcon />}
				isActive={router.pathname.startsWith('/favorites')}
			>
				Избранное
			</NavbarButton>

			<NavbarButton
				href='/cart'
				variant='link'
				icon={
					<BadgeCartCount>
						{router.pathname.startsWith('/cart') ? <CartFilledIcon /> : <CartIcon />}
					</BadgeCartCount>
				}
				isActive={router.pathname.startsWith('/cart')}
			>
				Корзина
			</NavbarButton>
		</Box>
	);
};
