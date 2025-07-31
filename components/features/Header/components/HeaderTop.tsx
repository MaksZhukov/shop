import { Box, Button, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { Link } from 'components/ui';
import {
	CartIcon,
	CartFilledIcon,
	DashboardFilledIcon,
	HeartIcon,
	HeartFilledIcon,
	SearchIcon,
	GeoIcon
} from 'components/Icons';
import { NavbarButton } from 'components/ui/NavbarButton';
import Autocomplete from 'components/Autocomplete';
import Profile from '../Profile';
import reactStringReplace from 'react-string-replace';
import { highlightSearchTerms } from 'services/StringService';

interface HeaderTopProps {
	isScrolled: boolean;
	searchValue: string;
	setSearchValue: (value: string) => void;
	searchedSpareParts: any;
	isFetching: boolean;
	onClickSignIn: () => void;
	onClickLogout: () => void;
	onOpenMobileSearch: () => void;
	onOpenMobileContacts: () => void;
}

export const HeaderTop: React.FC<HeaderTopProps> = ({
	isScrolled,
	searchValue,
	setSearchValue,
	searchedSpareParts,
	isFetching,
	onClickSignIn,
	onClickLogout,
	onOpenMobileSearch,
	onOpenMobileContacts
}) => {
	const router = useRouter();

	const handleInputChange = async (_: React.SyntheticEvent, value: string) => {
		setSearchValue(value);
	};

	const handleChange = (_: React.SyntheticEvent, value: any) => {
		router.push(`/spare-parts/${value.brand.slug}/${value.slug}`);
	};

	return (
		<Box
			display='flex'
			mb={{ xs: 0, md: isScrolled ? 0 : 1 }}
			gap={2}
			alignItems='center'
			justifyContent={{ xs: 'space-between', sm: 'initial' }}
		>
			<Link href='/'>
				<Box width={170} height={40} bgcolor='gray' display='flex' alignItems='center' justifyContent='center'>
					Logo
				</Box>
			</Link>

			<Button
				sx={{ display: { xs: 'none', sm: 'flex' } }}
				href='/spare-parts'
				size='medium'
				startIcon={<DashboardFilledIcon />}
				variant='contained'
				color='primary'
			>
				Каталог
			</Button>

			<Autocomplete
				options={
					searchedSpareParts?.data?.data.map((item: any) => ({
						label: item.h1,
						slug: item.slug,
						brand: item.brand,
						value: item.id
					})) || []
				}
				loadingText='Загрузка...'
				loading={isFetching}
				inputValue={searchValue}
				withSearchIcon
				sx={{ flex: 1, display: { xs: 'none', sm: 'flex' } }}
				fullWidth
				open={searchValue.length > 2}
				noOptionsText='Нет результатов'
				onChange={handleChange}
				onInputChange={handleInputChange}
				placeholder='Поиск запчастей'
				renderOption={(props, option) => (
					<li {...props}>
						{reactStringReplace(
							option.label,
							highlightSearchTerms(option.label, searchValue),
							(match, i) => (
								<Typography key={i} component='span' color='text.primary'>
									{match}
								</Typography>
							)
						)}
					</li>
				)}
			/>

			<Box display={'flex'} sx={{ display: { xs: 'none', sm: 'flex' } }}>
				<Profile onClickSignIn={onClickSignIn} onClickLogout={onClickLogout} />

				<NavbarButton
					variant='link'
					href='/favorites'
					icon={router.pathname.startsWith('/favorites') ? <HeartFilledIcon /> : <HeartIcon />}
					isActive={router.pathname.startsWith('/favorites')}
				>
					Избранное
				</NavbarButton>

				<NavbarButton
					variant='link'
					href='/cart'
					icon={router.pathname.startsWith('/cart') ? <CartFilledIcon /> : <CartIcon />}
					isActive={router.pathname.startsWith('/cart')}
				>
					Корзина
				</NavbarButton>
			</Box>

			{/* Mobile phone link */}
			<Box alignItems={'center'} gap={0.5} sx={{ display: { xs: 'flex', sm: 'none' } }}>
				<IconButton sx={{ padding: '0' }} onClick={onOpenMobileSearch}>
					<SearchIcon />
				</IconButton>
				<IconButton onClick={onOpenMobileContacts} sx={{ padding: '0' }}>
					<GeoIcon />
				</IconButton>
			</Box>
		</Box>
	);
};
