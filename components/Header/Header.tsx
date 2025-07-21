import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
	AppBar,
	Box,
	Button,
	Collapse,
	Container,
	Divider,
	Grow,
	IconButton,
	Input,
	MenuItem,
	MenuList,
	Modal,
	Popper,
	Toolbar,
	Typography,
	useTheme
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Brand } from 'api/brands/types';
import classNames from 'classnames';
import Image from 'components/Image';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import NextLink from 'next/link';
import React, { Fragment, HTMLAttributeAnchorTarget, useEffect, useRef, useState } from 'react';
import { useOutsideClick } from 'rooks';
import { useStore } from 'store';
import ModalAuth from '../ModalAuth';
import styles from './Header.module.scss';
import Profile from './Profile';
import { Link, ModalContainer } from 'components/ui';
import {
	CartIcon,
	DashboardIcon,
	GeoIcon,
	HeartIcon,
	PhoneCallIcon,
	SearchIcon,
	TelegramIcon,
	ViberIcon,
	WhatsAppIcon
} from 'components/Icons';
import { NavbarButton } from 'components/ui/NavbarButton';
import { WorkTimetable } from 'components/features/WorkTimetable';
import { SocialButtons } from 'components/features/SocialsButtons';
import { SOCIAL_BUTTONS } from 'components/features/SocialsButtons/constants';

const SOCIAL_BUTTONS_MOBILE = SOCIAL_BUTTONS.filter((item) => ['Telegram', 'WhatsApp', 'Viber'].includes(item.name));

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
	const timeoutRef = useRef<number>(0);
	const router = useRouter();
	const theme = useTheme();
	const store = useStore();
	const { enqueueSnackbar } = useSnackbar();
	const { code } = router.query;

	const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false);
	const [isOpenedMobileContacts, setIsOpenedMobileContacts] = useState<boolean>(false);
	const [isOpenedTabletMenu, setIsOpenedTabletMenu] = useState<boolean>(false);
	const [isScrolled, setIsScrolled] = useState<boolean>(false);
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

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			setIsScrolled(scrollTop > 0);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

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

	const handleOpenYandexMaps = () => {
		// Coordinates for Полотково, Гродненская область, Беларусь
		const latitude = 53.584958;
		const longitude = 23.861179;
		const address = 'Полотково, Гродненская область, Беларусь';

		// Open Yandex Maps with coordinates
		const yandexMapsUrl = `https://yandex.ru/maps/?pt=${longitude},${latitude}&z=15&l=map&text=${encodeURIComponent(
			address
		)}`;
		window.open(yandexMapsUrl, '_blank');
	};

	const renderLink = (item: NavigationChild) => {
		return <div></div>;
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
		<>
			<AppBar sx={{ py: theme.spacing(2) }} color='secondary' position='fixed'>
				<Container>
					<Box
						display='flex'
						mb={{ xs: 0, md: isScrolled ? 0 : 1 }}
						gap={2}
						alignItems='center'
						justifyContent={{ xs: 'space-between', sm: 'initial' }}
					>
						<Link href='/'>
							<Box
								width={170}
								height={40}
								bgcolor='gray'
								display='flex'
								alignItems='center'
								justifyContent='center'
							>
								Logo
							</Box>
						</Link>
						<Button
							size='medium'
							startIcon={<DashboardIcon />}
							variant='contained'
							color='primary'
							sx={{ display: { xs: 'none', sm: 'flex' } }}
						>
							Каталог
						</Button>
						<Input
							sx={{ flex: 1, display: { xs: 'none', sm: 'flex' } }}
							size='medium'
							startAdornment={<SearchIcon />}
							placeholder='Поиск запчастей'
						></Input>
						<Box display={'flex'} sx={{ display: { xs: 'none', sm: 'flex' } }}>
							<Profile onClickSignIn={handleClick} onClickLogout={handleClickLogout}></Profile>
							<Link href='/favorites'>
								<NavbarButton icon={<HeartIcon />}>Избранное</NavbarButton>
							</Link>
							<Link href='/cart'>
								<NavbarButton icon={<CartIcon />}>Корзина</NavbarButton>
							</Link>
						</Box>
						{/* Mobile phone link */}
						<Box alignItems={'center'} gap={0.5} sx={{ display: { xs: 'flex', sm: 'none' } }}>
							<IconButton sx={{ padding: '0' }}>
								<SearchIcon />
							</IconButton>
							<IconButton onClick={() => setIsOpenedMobileContacts(true)} sx={{ padding: '0' }}>
								<GeoIcon />
							</IconButton>
							<Modal open={isOpenedMobileContacts} onClose={() => setIsOpenedMobileContacts(false)}>
								<ModalContainer
									px={1}
									py={1}
									onClose={() => setIsOpenedMobileContacts(false)}
									title='Контакты'
									width='344px'
									sx={{
										position: 'absolute',
										top: '50%',
										left: '50%',
										maxHeight: '95vh',
										overflow: 'auto',
										transform: 'translate(-50%, -50%)'
									}}
								>
									<Box
										mb={1.5}
										display={'flex'}
										alignItems={'center'}
										flexDirection={'column'}
										gap={1.5}
									>
										<WorkTimetable />
										<Typography display={'flex'} alignItems='center' gap={1}>
											<Image
												isOnSSR={false}
												src='/mts_icon.png'
												alt='phone'
												quality={100}
												width={20}
												height={20}
											/>{' '}
											<Link href='tel:+375297804780'>+375297804780</Link>
										</Typography>
										<Typography display={'flex'} alignItems='center' gap={1}>
											<Image
												isOnSSR={false}
												src='/a1_icon.png'
												alt='phone'
												quality={100}
												width={24}
												height={24}
											/>{' '}
											<Link href='tel:+375296011602'>+375296011602</Link>
										</Typography>
									</Box>
									<SocialButtons sx={{ justifyContent: 'center' }} data={SOCIAL_BUTTONS_MOBILE} />
									<Box mt={1.5} bgcolor='#F5F5F5' p={1.5} py={1} borderRadius={4}>
										<Typography variant='h6' fontSize={18}>
											Авторазборка Полотково ООО "Дриблинг"
										</Typography>
										<Typography mb={1} variant='body2'>
											Гродненская область, Гродненский район, с/с Коптевский, д. Полотково
										</Typography>
										<iframe
											src='https://yandex.com/map-widget/v1/?um=constructor%3A8e4478010012318b78f66dc37db42cd1a6247bbea253e93b24602e1ac041c3c0&amp;source=constructor'
											width='100%'
											height='304'
											frameBorder='0'
										></iframe>
										<Button
											variant='contained'
											fullWidth
											onClick={handleOpenYandexMaps}
											sx={{ mt: 1 }}
										>
											Проложить маршрут
										</Button>
									</Box>
								</ModalContainer>
							</Modal>
						</Box>
					</Box>
					<Box
						color={'text.primary'}
						display={'flex'}
						justifyContent='space-between'
						flexWrap='wrap'
						gap={1}
						sx={{
							display: { xs: 'none', sm: isScrolled ? 'none' : 'flex' },
							transition: 'opacity 0.3s ease-in-out',
							opacity: isScrolled ? 0 : 1,
							height: isScrolled ? 0 : 'auto',
							overflow: 'hidden'
						}}
					>
						<Box display={'flex'} gap={2}>
							<Link href='/spare-parts?kindSparePart=dvigatel'>Двигатели</Link>
							<Link href='/spare-parts?kindSparePart=kpp-avtomaticheskaya-akpp'>Коробки АКПП</Link>
							<Link href='/spare-parts?kindSparePart=kpp-mehanicheskaya-mkpp'>МКПП</Link>
							<Link href='/tires'>Шины</Link>
							<Link href='/wheels'>Диски</Link>
							<Link href='/delivery'>Доставка и оплата</Link>
							<Link href='/contacts'>Контакты</Link>
						</Box>
						<Box display={'flex'} gap={2} alignItems='center'>
							<WorkTimetable />
							<Typography display={'flex'} alignItems='center' gap={1}>
								<Image
									isOnSSR={false}
									src='/mts_icon.png'
									alt='phone'
									quality={100}
									width={20}
									height={20}
								/>{' '}
								<Link href='tel:+375297804780'>+375297804780</Link>
							</Typography>
							<Typography display={'flex'} alignItems='center' gap={1}>
								<Image
									isOnSSR={false}
									src='/a1_icon.png'
									alt='phone'
									quality={100}
									width={24}
									height={24}
								/>{' '}
								<Link href='tel:+375296011602'>+375296011602</Link>
							</Typography>
						</Box>
					</Box>
				</Container>
			</AppBar>

			{/* Mobile Bottom Navigation Bar */}
			<Box
				sx={{
					display: { xs: 'flex', sm: 'none' },
					position: 'fixed',
					bottom: 0,
					left: 0,
					right: 0,
					zIndex: 1000,
					bgcolor: 'background.paper',
					borderTop: 1,
					borderColor: 'divider',
					padding: 1,
					justifyContent: 'space-around',
					alignItems: 'center'
				}}
			>
				<Profile onClickSignIn={handleClick} onClickLogout={handleClickLogout}></Profile>
				<Link href='/favorites'>
					<NavbarButton icon={<HeartIcon />}>Избранное</NavbarButton>
				</Link>
				<Link href='/cart'>
					<NavbarButton icon={<CartIcon />}>Корзина</NavbarButton>
				</Link>
			</Box>
		</>
	);
});

export default Header;
