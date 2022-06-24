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
import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ModalAuth from '../ModalAuth';
import { Box } from '@mui/system';
import styles from './Header.module.scss';
import { useStore } from '../../store';
import { observer } from 'mobx-react';
import Profile from './Profile';

const pages = [
	{ name: 'Главная', path: '/' },
	{ name: 'Ожидаемые авто', path: '/' },
	{ name: 'Покупка авто на запчасти', path: '/' },
	{ name: 'Доставка/ Оплата', path: '/' },
	{ name: 'Гарантия', path: '/' },
	{ name: 'Отзывы', path: '/reviews' },
	{ name: 'Контакты', path: '/contacts' },
];

const Header = observer(() => {
	const router = useRouter();
	const { code } = router.query;

	const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false);
	const [isOpenedMenu, setIsOpenedMenu] = useState<boolean>(false);
	useEffect(() => {
		if (code) {
			setIsOpenedModal(true);
		}
	}, [code]);
	const handleClick = () => {
		setIsOpenedModal(true);
	};

	const handleToggleMenu = () => {
		setIsOpenedMenu(!isOpenedMenu);
	};

	const renderLogo = (type: 'mobile' | 'desktop') => (
		<Box
			sx={{
				display:
					type == 'desktop'
						? { xs: 'none', md: 'flex' }
						: { xs: 'flex', md: 'none' },
			}}
			{...(type === 'mobile' ? { flex: 1 } : {})}>
			<Link passHref href='/'>
				<Typography component='a' variant='h5' color='white'>
					Logo
				</Typography>
			</Link>
		</Box>
	);

	const renderMobileMenu = (
		<Toolbar className={styles.toolbar}>
			<Collapse in>
				<MenuList
					sx={{
						flex: 1,
						display: { xs: 'block', md: 'none' },
					}}>
					{pages.map((page) => (
						<MenuItem key={page.name}>
							<Typography color='white' textAlign='center'>
								<Link href={page.path}>{page.name}</Link>
							</Typography>
						</MenuItem>
					))}
				</MenuList>
			</Collapse>
		</Toolbar>
	);

	return (
		<AppBar position='fixed'>
			<Container>
				<Toolbar className={styles.toolbar}>
					{renderLogo('desktop')}
					<Box
						color='white'
						flex='1'
						sx={{
							display: { xs: 'flex', md: 'none' },
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
					<Box
						justifyContent='center'
						padding='0 10px'
						display='flex'
						flex='1'
						sx={{
							display: { xs: 'none', md: 'flex' },
						}}>
						{pages.map((page) => (
							<Button
								className={styles.menu__item}
								key={page.name}>
								<Link href={page.path}>{page.name}</Link>
							</Button>
						))}
					</Box>
					<Profile onClickSignIn={handleClick}></Profile>
					{isOpenedModal && (
						<ModalAuth
							isResetPassword={!!code}
							onChangeModalOpened={setIsOpenedModal}></ModalAuth>
					)}
				</Toolbar>
				<Collapse in={isOpenedMenu}>{renderMobileMenu}</Collapse>
			</Container>
		</AppBar>
	);
});

export default Header;
