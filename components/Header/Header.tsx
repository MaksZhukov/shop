import {
	AppBar,
	Avatar,
	Button,
	Collapse,
	Container,
	IconButton,
	Toolbar,
} from '@mui/material';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
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
import useOutsideClick from '@rooks/use-outside-click';

const pages = [
	{ name: 'Главная', path: '/' },
	{ name: 'Ожидаемые авто', path: '/awaiting-cars' },
	{ name: 'Покупка авто на запчасти', path: '/buyingCar' },
	{ name: 'Доставка/Оплата', path: '/shippingAndPayment' },
	{ name: 'Гарантия', path: '/guarantee' },
	{ name: 'Отзывы', path: '/reviews' },
	{ name: 'Контакты', path: '/contacts' },
];

const Header = observer(() => {
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
			{pages.map((page) => (
				<Link key={page.name} href={page.path}>
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
			))}
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
