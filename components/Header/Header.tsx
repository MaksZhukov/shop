import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
	AppBar,
	Button,
	Collapse,
	Container,
	Divider,
	Grow,
	IconButton,
	Link,
	MenuItem,
	MenuList,
	Popper,
	Toolbar
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/system';
import { Brand } from 'api/brands/types';
import classNames from 'classnames';
import Image from 'components/Image';
import { observer } from 'mobx-react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { Fragment, HTMLAttributeAnchorTarget, useEffect, useRef, useState } from 'react';
import { useOutsideClick } from 'rooks';
import { useStore } from 'store';
import ModalAuth from '../ModalAuth';
import styles from './Header.module.scss';
import Profile from './Profile';

interface NavigationChild {
	name: string;
	path: string;
	id: string | number;
	target?: HTMLAttributeAnchorTarget;
}
interface Navigation {
	id: string;
	name: string;
	path?: string;
	children: NavigationChild[];
}

const carBrandsProductCatalogSlugs: { [key: string]: string } = {
	'spare-parts': 'spare-parts',
	wheels: 'wheels',
	cabins: 'cabins'
};

export const getNavigation = (brands: Brand[], mainSlug: string): Navigation[] => [
	{
		name: 'Магазин',
		path: '/',
		children: [
			{ name: 'Запчасти', path: '/spare-parts', id: 'spareParts' },
			{ name: 'Шины', path: '/tires', id: 'tires' },
			{ name: 'Салоны', path: '/cabins', id: 'cabins' },
			{ name: 'Диски', path: '/wheels', id: 'wheels' }
		],
		id: 'shop'
	},
	{
		name: 'О нас',
		path: '/about',
		children: [
			{ name: 'Как добраться', path: '/how-to-get-to', id: 'how-to-get-to' },
			{
				name: 'Фото разборки',
				path: '/company-photo',
				id: 'photo'
			},
			{ name: 'Отзывы', path: '/reviews', id: 'reviews' },
			{ name: 'Вакансии', path: '/vacancies', id: 'vacancy' },
			{ name: 'Эвакуатор', path: 'https://dostavka-auto.by/', target: '_blank', id: 'towTruck' }
		],
		id: 'aboutUs'
	},
	{
		name: 'Оплата',
		path: '/payment',
		children: [
			{ name: 'Гарантия', path: '/guarantee', id: 'guarantee' },
			{ name: 'Доставка', path: '/delivery', id: 'delivery' },
			{ name: 'Рассрочка', path: '/installment-plan', id: 'installmentPlan' }
		],
		id: 'payment'
	},
	{ name: 'Контакты', path: '/contacts', id: 'contacts', children: [] },
	{ name: 'Блог', path: '/articles', id: 'blog', children: [] },
	{
		id: 'CarBrands',
		name: 'Марки авто',
		children: brands.map((item) => ({
			id: item.id,
			name: item.name,
			path: `/${carBrandsProductCatalogSlugs[mainSlug] || 'spare-parts'}/${item.slug}`
		}))
	},
	{ name: 'Ожидаемые авто', path: '/awaiting-cars', id: 'awaiting-cars', children: [] },
	{
		name: 'Выкуп авто на з/ч',
		path: '/buyback-cars',
		id: 'buybackCar',
		children: [{ name: 'фото/вид', path: '/car-dismantling-photos', id: 'photo-view' }]
	}
];

interface Props {
	brands: Brand[];
}

const Header = observer(({ brands }: Props) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const timeoutRef = useRef<number>();
	const router = useRouter();
	const store = useStore();
	const { enqueueSnackbar } = useSnackbar();
	const { code } = router.query;

	const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false);
	const [isOpenedTabletMenu, setIsOpenedTabletMenu] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

	const handleOutsideClick = () => {
		if (isTablet) {
			setIsOpenedTabletMenu(false);
		}
	};

	useOutsideClick(ref as any, handleOutsideClick);

	useEffect(() => {
		if (code) {
			setIsOpenedModal(true);
		}
	}, [code]);

	useEffect(() => {
		if (!isTablet) {
			setIsOpenedTabletMenu(false);
		}
	}, [isTablet]);

	const handleClick = () => {
		setIsOpenedModal(true);
	};

	const handleToggleMenu = () => {
		setIsOpenedTabletMenu(!isOpenedTabletMenu);
	};

	const handleSubMenuClose = () => {
		setAnchorEl(null);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = window.setTimeout(() => {
			handleSubMenuClose();
		}, 300);
	};

	const handleMouseOver = (event: React.MouseEvent<HTMLElement>) => {
		clearTimeout(timeoutRef.current);
		if (event.currentTarget !== anchorEl) {
			setAnchorEl(event.currentTarget);
		}
	};

	const handleMouseEnter = () => {
		clearTimeout(timeoutRef.current);
	};

	const handleClickButton = (event: React.MouseEvent<SVGSVGElement>) => {
		if (!anchorEl) {
			setAnchorEl(event.currentTarget.parentElement?.parentElement as HTMLElement);
		} else {
			setAnchorEl(null);
		}
	};

	const handleClickLinkTablet = () => {
		setIsOpenedTabletMenu(false);
		setAnchorEl(null);
	};

	const handleClickLogout = async () => {
		try {
			await store.user.logout();
			enqueueSnackbar('Вы успешно вышли из аккаунта', {
				variant: 'success'
			});
		} catch (err) {
			enqueueSnackbar('Произошла какая-то ошибка с выходом из аккаунта, обратитесь в поддержку', {
				variant: 'error'
			});
		}
		router.push('/', undefined, { shallow: true });
	};

	const renderLink = (item: NavigationChild) => {
		let LinkComp = item.target ? Link : NextLink;
		return (
			<LinkComp
                prefetch={false}
				className={styles.link}
				underline='none'
				style={{ color: '#000' }}
				target={item.target}
				href={item.path}
				{...(isTablet
					? {
							onClick: handleClickLinkTablet
					  }
					: {})}
			>
				{item.name}
			</LinkComp>
		);
	};

	const renderMenuList = (page: Navigation) => (
		<MenuList
			{...(!isTablet
				? {
						onMouseLeave: handleMouseLeave,
						onMouseEnter: handleMouseEnter,
						className: styles.submenu
				  }
				: {})}
			sx={{
				padding: 0,
				maxHeight: { xs: '200px', md: 'initial' },
				overflow: 'auto'
			}}
		>
			{page.children?.map((item) => (
				<MenuItem
					sx={{
						minHeight: 'initial',
						padding: '0'
					}}
					key={item.id}
				>
					{renderLink(item)}
				</MenuItem>
			))}
		</MenuList>
	);

	const renderShoppingCartBtn = (
		<NextLink prefetch={false} href='/favorites'>
			<IconButton size='small'>
				<ShoppingCartIcon sx={{ color: '#fff' }}></ShoppingCartIcon>
			</IconButton>
		</NextLink>
	);

	const navigation = getNavigation(brands, router.asPath.split('/')[1]);

	const renderLogo = (type: 'mobile' | 'desktop') => (
		<Box
			sx={{
				display: type == 'desktop' ? { xs: 'none', md: 'flex' } : { xs: 'flex', md: 'none' }
			}}
			{...(type === 'mobile' ? { order: { xs: '2', md: 'initial' } } : {})}
		>
			<NextLink prefetch={false} href='/'>
				<Image
					title={'Разборка авто'}
					style={{ cursor: 'pointer' }}
					alt={'Разборка авто'}
					width={123}
					height={34}
					quality={100}
					isOnSSR={false}
					src='/logo.png'
				/>
			</NextLink>
		</Box>
	);

	const renterRootMenuBtn = (
		page: Navigation,
		type: 'mobile' | 'desktop',
		isOpened: boolean,
		onClick?: () => void
	) => {
		let ArrowIcon =
			type === 'desktop' ? KeyboardArrowDownIcon : isOpened ? KeyboardArrowUpIcon : KeyboardArrowDownIcon;
		return (
			<Button
				onClick={onClick}
				{...(!isTablet
					? {
							onMouseOver: handleMouseOver,
							onMouseLeave: handleMouseLeave,
							'aria-haspopup': 'true',
							'aria-expanded': anchorEl ? 'true' : undefined
					  }
					: {})}
				className={classNames(styles.menu__item, {
					[styles['menu__item_active']]: page.children?.some((item) => item.path === router.pathname),
					[styles[`menu__item_${type}`]]: type
				})}
				{...(page.children.length
					? {
							endIcon: <ArrowIcon onClick={handleClickButton}></ArrowIcon>
					  }
					: {})}
			>
				{page.path && isTablet ? (
					<NextLink href={page.path} prefetch={false} onClick={handleClickLinkTablet}>
						{page.name}
					</NextLink>
				) : (
					page.name
				)}
			</Button>
		);
	};

	const renderProfileMenuItems = (
		<>
			<Divider />
			{store.user.id
				? renterRootMenuBtn({ id: 'profile', name: 'Профиль', path: '/profile', children: [] }, 'mobile', false)
				: renterRootMenuBtn(
						{ id: 'signin', name: 'Войти', path: '', children: [] },
						'mobile',
						false,
						handleClick
				  )}
			{renterRootMenuBtn(
				{
					id: 'signin',
					name: `Избранные ${store.favorites.items.length}`,
					path: '/favorites',
					children: []
				},
				'mobile',
				false
			)}
			{store.user.id &&
				renterRootMenuBtn(
					{ id: 'signout', name: 'Выход', path: '', children: [] },
					'mobile',
					false,
					handleClickLogout
				)}
		</>
	);

	const renderMenu = (type: 'mobile' | 'desktop') => (
		<Box
			padding='0 10px'
			{...(type === 'mobile'
				? {
						flexDirection: 'column',
						width: '100%',
						sx: { display: { md: 'none', xs: 'flex' } }
				  }
				: {
						sx: { display: { md: 'flex', xs: 'none' }, justifyContent: { md: 'start', lg: 'center' } },
						flex: '1',
						flexWrap: 'wrap'
				  })}
		>
			{navigation.map((page, index) => {
				return (
					<Fragment key={page.id}>
						<>
							{page.path && !isTablet ? (
								<NextLink prefetch={false} href={page.path} passHref>
									{renterRootMenuBtn(page, type, anchorEl?.textContent === page.name)}
								</NextLink>
							) : (
								renterRootMenuBtn(page, type, anchorEl?.textContent === page.name)
							)}
							{isTablet && anchorEl?.textContent === page.name && renderMenuList(page)}
							{!isTablet && anchorEl?.textContent === page.name && (
								<Popper
									open={!!anchorEl}
									anchorEl={anchorEl}
									role={undefined}
									placement='bottom-start'
									transition
									sx={{ zIndex: 1, top: { sm: '-3px !important' } }}
									disablePortal
								>
									{({ TransitionProps, placement }) => (
										<Grow
											{...TransitionProps}
											style={{
												maxHeight: 300,
												overflow: 'auto',
												minWidth: anchorEl.clientWidth,
												transformOrigin:
													placement === 'bottom-start' ? 'left top' : 'left bottom'
											}}
											timeout={300}
										>
											{renderMenuList(page)}
										</Grow>
									)}
								</Popper>
							)}
						</>
					</Fragment>
				);
			})}
			{isTablet && renderProfileMenuItems}
		</Box>
	);

	return (
		<AppBar position='fixed'>
			<Container ref={ref}>
				<Toolbar
					sx={{ justifyContent: 'space-between', minHeight: { xs: '56px', md: '64px' } }}
					className={styles.toolbar}
				>
					{renderLogo('desktop')}
					<Box
						color='black'
						alignItems='center'
						sx={{
							display: { xs: 'flex', md: 'none' },
							flex: { xs: 'initial', md: '1' },
							order: { xs: '3', md: 'initial' }
						}}
						className={styles['mobile-menu']}
					>
						{renderShoppingCartBtn}
						<IconButton
							size='small'
							aria-controls='header-menu'
							color='inherit'
							title='Меню'
							aria-haspopup='true'
							onClick={handleToggleMenu}
						>
							<MenuIcon sx={{ color: '#fff' }} />
						</IconButton>
					</Box>
					{renderLogo('mobile')}
					{!isTablet && renderMenu('desktop')}
					{!isTablet && (
						<>
							{renderShoppingCartBtn}
							<Profile onClickLogout={handleClickLogout} onClickSignIn={handleClick}></Profile>
						</>
					)}
					{isOpenedModal && (
						<ModalAuth isResetPassword={!!code} onChangeModalOpened={setIsOpenedModal}></ModalAuth>
					)}
				</Toolbar>
				{isTablet && (
					<Collapse in={isOpenedTabletMenu}>
						<Toolbar className={styles.toolbar}>{renderMenu('mobile')}</Toolbar>
					</Collapse>
				)}
			</Container>
		</AppBar>
	);
});

export default Header;
