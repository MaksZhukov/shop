import {
	AppBar,
	Avatar,
	Button,
	Collapse,
	Container,
	IconButton,
	Menu,
	MenuItem,
	MenuList,
	Toolbar,
	Typography,
} from '@mui/material';
import { Fragment, useEffect, useRef, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ModalAuth from '../ModalAuth';
import { Box } from '@mui/system';
import styles from './Header.module.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import { observer } from 'mobx-react';
import Profile from './Profile';
import classNames from 'classnames';
import Image from 'next/image';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useOutsideClick } from 'rooks';
import { Brand } from 'api/brands/types';

const getNavigation = (brands: Brand[]) => [
	{
		name: 'Магазин',
		children: [
			{ name: 'Запчасти', path: '/spare-parts' },
			{ name: 'Шины', path: '/tires' },
			{ name: 'Салоны', path: '/' },
			{ name: 'Диски', path: '/wheels' },
		],
	},
	{
		name: 'О нас',
		children: [
			{ name: 'Как добраться', path: '/1' },
			{ name: 'Фото разборки', path: '/1' },
			{ name: 'Отзывы', path: '/1' },
			{ name: 'Вакансии', path: '/1' },
			{ name: 'Эвакуатор', path: '/1' },
		],
	},
	{
		name: 'Оплата',
		children: [
			{ name: 'Гарантия', path: '/1' },
			{ name: 'Доставка', path: '/1' },
			{ name: 'Рассрочка', path: '/1' },
			{ name: 'Вакансии', path: '/1' },
			{ name: 'Эвакуатор', path: '/1' },
		],
	},
	{ name: 'Контакты', path: '/contacts' },
	{ name: 'Блог', path: '/blog' },
	{
		name: 'Марки авто',
		children: brands.map((item) => ({ name: item.name, path: '/path' })),
	},
	{ name: 'Ожидаемые авто', path: '/awaiting-cars' },
	{ name: 'Авто на запчасти', children: [{ name: 'фото/вид', path: '/1' }] },
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
	const router = useRouter();
	const { code } = router.query;

	const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false);
	const [isOpenedMobileMenu, setIsOpenedMobileMenu] =
		useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);
	const isTablet = useMediaQuery((theme: any) =>
		theme.breakpoints.down('md')
	);

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
		router.push(path);
		handleSubMenuClose();
	};

	const navigation = getNavigation(brands);

	const renderLogo = (type: 'mobile' | 'desktop') => (
		<Box
			sx={{
				display:
					type == 'desktop'
						? { xs: 'none', md: 'flex' }
						: { xs: 'flex', md: 'none' },
			}}
			{...(type === 'mobile' ? {} : {})}>
			<Link href='/'>
				<Image
					style={{ cursor: 'pointer' }}
					alt='Picture of the author'
					width={150}
					height={42}
					src='/logo.jpg'
				/>
			</Link>
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
				  })}>
			{navigation.map((page, index) => {
				return (
					<Fragment key={page.name}>
						{page.path ? (
							<Link href={page.path} passHref>
								<Button
									onClick={handleClickMenuItem}
									className={classNames(styles.menu__item, {
										[styles['menu__item_active']]:
											router.pathname === page.path,
										[styles[`menu__item_${type}`]]: type,
									})}>
									{page.name}
								</Button>
							</Link>
						) : (
							<>
								<Button
									onClick={(
										event: React.MouseEvent<HTMLElement>
									) => {
										if (anchorEl) {
											setAnchorEl(null);
										} else {
											setAnchorEl(event.currentTarget);
										}
									}}
									{...(!isTablet
										? {
												id: 'products-button',
												'aria-controls': anchorEl
													? 'products-list'
													: undefined,
												'aria-haspopup': 'true',
												'aria-expanded': anchorEl
													? 'true'
													: undefined,
										  }
										: {})}
									className={classNames(styles.menu__item, {
										[styles['menu__item_active']]:
											page.children?.some(
												(item) =>
													item.path ===
													router.pathname
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
									}>
									{page.name}
								</Button>
								{isTablet &&
									anchorEl?.textContent === page.name && (
										<MenuList
											sx={{
												padding: 0,
											}}>
											{page.children?.map((item) => (
												<MenuItem
													sx={{
														minHeight: 'initial',
													}}
													key={item.name}
													onClick={handleSubMenuClick(
														item.path
													)}>
													<Link href={item.path}>
														{item.name}
													</Link>
												</MenuItem>
											))}
										</MenuList>
									)}
								{!isTablet &&
									anchorEl?.textContent === page.name && (
										<Menu
											classes={{
												list: styles.submenu,
												paper: styles[
													'submenu-wrapper'
												],
											}}
											id='products-menu'
											MenuListProps={{
												'aria-labelledby':
													'products-button',
											}}
											anchorEl={anchorEl}
											open={!!anchorEl}
											onClose={handleSubMenuClose}>
											{page.children?.map((item) => (
												<MenuItem
													sx={{
														minWidth:
															anchorEl.clientWidth,
													}}
													href={item.path}
													key={item.name}
													onClick={handleSubMenuClick(
														item.path
													)}>
													<Link href={item.path}>
														{item.name}
													</Link>
												</MenuItem>
											))}
										</Menu>
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
				<Toolbar
					sx={{ justifyContent: 'space-between' }}
					className={styles.toolbar}>
					{renderLogo('desktop')}
					<Box
						color='white'
						sx={{
							display: { xs: 'flex', md: 'none' },
							flex: { xs: 'initial', md: '1' },
						}}
						className={styles['mobile-menu']}>
						<IconButton
							size='large'
							aria-controls='header-menu'
							color='inherit'
							aria-haspopup='true'
							onClick={handleToggleMenu}>
							<MenuIcon />
						</IconButton>
					</Box>
					{renderLogo('mobile')}
					{!isTablet && renderMenu('desktop')}
					<Profile onClickSignIn={handleClick}></Profile>
					{isOpenedModal && (
						<ModalAuth
							isResetPassword={!!code}
							onChangeModalOpened={setIsOpenedModal}></ModalAuth>
					)}
				</Toolbar>
				{isTablet && (
					<Collapse in={isOpenedMobileMenu}>
						<Toolbar className={styles.toolbar}>
							{renderMenu('mobile')}
						</Toolbar>
					</Collapse>
				)}
			</Container>
		</AppBar>
	);
});

export default Header;
