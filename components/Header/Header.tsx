import {
	AppBar,
	Avatar,
	Button,
	Collapse,
	Container,
	Grow,
	IconButton,
	Link,
	Menu,
	MenuItem,
	MenuList,
	Popper,
	Toolbar,
	Typography,
} from '@mui/material';
import React, { Fragment, HTMLAttributeAnchorTarget, useEffect, useRef, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import ModalAuth from '../ModalAuth';
import { Box } from '@mui/system';
import styles from './Header.module.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { observer } from 'mobx-react';
import Profile from './Profile';
import classNames from 'classnames';
import NextLink from 'next/link';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useOutsideClick } from 'rooks';
import { Brand } from 'api/brands/types';
import qs from 'qs';
import Image from 'components/Image';

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

const getNavigation = (brands: Brand[]): Navigation[] => [
	{
		name: 'Магазин',
		children: [
			{ name: 'Запчасти', path: '/spare-parts', id: 'spareParts' },
			{ name: 'Шины', path: '/tires', id: 'tires' },
			{ name: 'Салоны', path: '/cabins', id: 'cabins' },
			{ name: 'Диски', path: '/wheels', id: 'wheels' },
		],
		id: 'shop',
	},
	{
		name: 'О нас',
		children: [
			{ name: 'Как добраться', path: '/how-to-get-to', id: 'how-to-get-to' },
			{
				name: 'Фото разборки',
				path: '/car-dismantling-photos',
				id: 'photo',
			},
			{ name: 'Отзывы', path: '/1', id: 'reviews' },
			{ name: 'Вакансии', path: '/vacancies', id: 'vacancy' },
			{ name: 'Эвакуатор', path: 'https://dostavka-auto.by/', target: '_blank', id: 'towTruck' },
		],
		id: 'aboutUs',
	},
	{
		name: 'Оплата',
		children: [
			{ name: 'Гарантия', path: '/guarantee', id: 'guarantee' },
			{ name: 'Доставка', path: '/delivery', id: 'delivery' },
			{ name: 'Рассрочка', path: '/installment-plan', id: 'installmentPlan' },
		],
		id: 'payment',
	},
	{ name: 'Контакты', path: '/contacts', id: 'contacts', children: [] },
	{ name: 'Блог', path: '/articles', id: 'blog', children: [] },
	{
		id: 'CarBrands',
		name: 'Марки авто',
		children: brands.map((item) => ({
			id: item.id,
			name: item.name,
			path: `/spare-parts?${qs.stringify({
				brandId: item.id,
				brandName: item.name,
			})}`,
		})),
	},
	{ name: 'Ожидаемые авто', path: '/awaiting-cars', id: 'awaiting-cars', children: [] },
	{
		name: 'Авто на запчасти',
		id: 'AutoParts',
		children: [{ name: 'фото/вид', path: '/1', id: 'photo-view' }],
	},
	// { name: 'Покупка авто на запчасти', path: '/buying-car' },
	// { name: 'Доставка/Оплата', path: '/shipping-and-payment' },
	// { name: 'Гарантия', path: '/guarantee' },
	// { name: 'Отзывы', path: '/reviews' },
];

interface Props {
	brands: Brand[];
}

const Header = observer(({ brands }: Props) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const timeoutRef = useRef<number>();
	const router = useRouter();
	const { code } = router.query;

	const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false);
	const [isOpenedMobileMenu, setIsOpenedMobileMenu] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

	const handleOutsideClick = () => {
		if (isTablet) {
			setIsOpenedMobileMenu(false);
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
			setIsOpenedMobileMenu(false);
		}
	}, [isTablet]);

	const handleClick = () => {
		setIsOpenedModal(true);
	};

	const handleToggleMenu = () => {
		setIsOpenedMobileMenu(!isOpenedMobileMenu);
	};

	const handleClickMenuItem = () => {
		setIsOpenedMobileMenu(false);
	};

	const handleSubMenuClose = () => {
		setAnchorEl(null);
	};

	const handleSubMenuClick = (path: string) => () => {
		router.push(path, undefined, { shallow: true });
		handleSubMenuClose();
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

	const handleClickButton = (event: React.MouseEvent<HTMLElement>) => {
		if (!anchorEl) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const renderLink = (item: NavigationChild) => {
		let LinkComp = item.target ? Link : NextLink;
		return (
			<LinkComp underline='none' color='#fff' target={item.target} href={item.path}>
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
						className: styles.submenu,
				  }
				: {})}
			sx={{
				padding: 0,
			}}
		>
			{page.children?.map((item) => (
				<MenuItem
					sx={{
						minHeight: 'initial',
					}}
					key={item.id}
				>
					{renderLink(item)}
				</MenuItem>
			))}
		</MenuList>
	);

	const navigation = getNavigation(brands);

	const renderLogo = (type: 'mobile' | 'desktop') => (
		<Box
			sx={{
				display: type == 'desktop' ? { xs: 'none', md: 'flex' } : { xs: 'flex', md: 'none' },
			}}
			{...(type === 'mobile' ? {} : {})}
		>
			<NextLink href='/'>
				<Image
					style={{ cursor: 'pointer' }}
					alt='Logo'
					width={150}
					height={42}
					isOnSSR={false}
					src='/logo.jpg'
				/>
			</NextLink>
		</Box>
	);

	const renderMenu = (type: 'mobile' | 'desktop') => (
		<Box
			padding='0 10px'
			{...(type === 'mobile'
				? {
						flexDirection: 'column',
						sx: { display: { md: 'none', xs: 'flex' } },
				  }
				: {
						sx: { display: { md: 'flex', xs: 'none' } },
						flex: '1',
						justifyContent: 'center',
				  })}
		>
			{navigation.map((page, index) => {
				return (
					<Fragment key={page.id}>
						{page.path ? (
							<NextLink href={page.path} passHref>
								<Button
									onClick={handleClickMenuItem}
									className={classNames(styles.menu__item, {
										[styles['menu__item_active']]: router.pathname === page.path,
										[styles[`menu__item_${type}`]]: type,
									})}
								>
									{page.name}
								</Button>
							</NextLink>
						) : (
							<>
								<Button
									{...(!isTablet
										? {
												onMouseOver: handleMouseOver,
												onMouseLeave: handleMouseLeave,
												'aria-haspopup': 'true',
												'aria-expanded': anchorEl ? 'true' : undefined,
										  }
										: { onClick: handleClickButton })}
									className={classNames(styles.menu__item, {
										[styles['menu__item_active']]: page.children?.some(
											(item) => item.path === router.pathname
										),
										[styles[`menu__item_${type}`]]: type,
									})}
									endIcon={
										<KeyboardArrowDownIcon
										// onClick={(
										// 	event: React.MouseEvent<SVGElement>
										// ) => {
										// 	event.stopPropagation();
										// 	if (anchorEl) {
										// 		setAnchorEl(null);
										// 	} else {
										// 		console.log(event);
										// 		setAnchorEl(
										// 			event.currentTarget
										// 				.parentElement
										// 				?.parentElement as HTMLElement
										// 		);
										// 	}
										// }}
										/>
									}
								>
									{page.name}
								</Button>
								{isTablet && anchorEl?.textContent === page.name && renderMenuList(page)}
								{!isTablet && anchorEl?.textContent === page.name && (
									<Popper
										open={!!anchorEl}
										anchorEl={anchorEl}
										role={undefined}
										placement='bottom-start'
										transition
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
														placement === 'bottom-start' ? 'left top' : 'left bottom',
												}}
												timeout={300}
											>
												{renderMenuList(page)}
											</Grow>
										)}
									</Popper>
								)}
							</>
						)}
					</Fragment>
				);
			})}
		</Box>
	);

	return (
		<AppBar position='fixed'>
			<Container ref={ref}>
				<Toolbar sx={{ justifyContent: 'space-between' }} className={styles.toolbar}>
					{renderLogo('desktop')}
					<Box
						color='white'
						sx={{
							display: { xs: 'flex', md: 'none' },
							flex: { xs: 'initial', md: '1' },
						}}
						className={styles['mobile-menu']}
					>
						<IconButton
							size='large'
							aria-controls='header-menu'
							color='inherit'
							aria-haspopup='true'
							onClick={handleToggleMenu}
						>
							<MenuIcon />
						</IconButton>
					</Box>
					{renderLogo('mobile')}
					{!isTablet && renderMenu('desktop')}
					<Profile onClickSignIn={handleClick}></Profile>
					{isOpenedModal && (
						<ModalAuth isResetPassword={!!code} onChangeModalOpened={setIsOpenedModal}></ModalAuth>
					)}
				</Toolbar>
				{isTablet && (
					<Collapse in={isOpenedMobileMenu}>
						<Toolbar className={styles.toolbar}>{renderMenu('mobile')}</Toolbar>
					</Collapse>
				)}
			</Container>
		</AppBar>
	);
});

export default Header;
