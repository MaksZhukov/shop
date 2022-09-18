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
} from '@mui/material';
import { Fragment, MutableRefObject, useEffect, useRef, useState } from 'react';
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
import useOutsideClick from '@rooks/use-outside-click';

const navigation = [
	{
		name: 'Товары',
		children: [
			{ name: 'Запчасти', path: '/' },
			//   { name: "Шины", path: "/tires" },
			//   { name: "Диски", path: "/wheels" },
		],
	},
	{ name: 'Ожидаемые авто', path: '/awaiting-cars' },
	{ name: 'Покупка авто на запчасти', path: '/buying-car' },
	{ name: 'Доставка/Оплата', path: '/shipping-and-payment' },
	{ name: 'Гарантия', path: '/guarantee' },
	{ name: 'Отзывы', path: '/reviews' },
	{ name: 'Контакты', path: '/contacts' },
];

const Header = observer(() => {
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

	const renderLogo = (type: 'mobile' | 'desktop') => (
		<Box
			sx={{
				display:
					type == 'desktop'
						? { xs: 'none', md: 'flex' }
						: { xs: 'flex', md: 'none' },
			}}
			{...(type === 'mobile' ? {} : {})}>
			<Link passHref href='/'>
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
			{navigation.map((page) => {
				return (
					<Fragment key={page.name}>
						{page.path ? (
							<Link href={page.path}>
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
												id: 'products',
												'aria-controls': anchorEl
													? 'fade-menu'
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
									endIcon={<KeyboardArrowDownIcon />}>
									{page.name}
								</Button>
								{isTablet && anchorEl && (
									<MenuList sx={{ padding: 0 }}>
										{page.children?.map((item) => (
											<MenuItem
												sx={{ minHeight: 'initial' }}
												key={item.name}
												onClick={handleSubMenuClick(
													item.path
												)}>
												{item.name}
											</MenuItem>
										))}
									</MenuList>
								)}
								{!isTablet && (
									<Menu
										classes={{
											list: styles.submenu,
											paper: styles['submenu-wrapper'],
										}}
										id='products'
										MenuListProps={{
											'aria-labelledby': 'products',
										}}
										anchorEl={anchorEl}
										open={!!anchorEl}
										onClose={handleSubMenuClose}>
										{page.children?.map((item) => (
											<MenuItem
												key={item.name}
												onClick={handleSubMenuClick(
													item.path
												)}>
												{item.name}
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
					{renderMenu('desktop')}
					<Profile onClickSignIn={handleClick}></Profile>
					{isOpenedModal && (
						<ModalAuth
							isResetPassword={!!code}
							onChangeModalOpened={setIsOpenedModal}></ModalAuth>
					)}
				</Toolbar>
				<Collapse in={isOpenedMobileMenu}>
					<Toolbar className={styles.toolbar}>
						{renderMenu('mobile')}
					</Toolbar>
				</Collapse>
			</Container>
		</AppBar>
	);
});

export default Header;
