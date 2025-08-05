import { Box, IconButton, Input } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { Link } from 'components/ui';
import { CartIcon, CartFilledIcon, HeartIcon, HeartFilledIcon, SearchIcon, GeoIcon } from 'components/icons';
import { NavbarButton } from 'components/ui/NavbarButton';
import Profile from '../Profile';
import { CatalogCategories } from './CatalogCategories';
import { SearchHistoryChips, SearchResults } from './';
import { WhiteBox, Loader } from 'components/ui';
import { SparePart } from 'api/spareParts/types';
import { useOutsideClick } from 'rooks';

interface HeaderTopProps {
	isScrolled: boolean;
	searchValue: string;
	onChangeSearchValue: (value: string) => void;
	searchHistory: string[];
	searchedSpareParts: SparePart[];
	isFetching: boolean;
	onClickSignIn: () => void;
	onClickLogout: () => void;
	onOpenMobileSearch: () => void;
	onSearchSelect: (item: SparePart) => void;
	onOpenMobileContacts: () => void;
	onDeleteSearchHistory: (value: string) => void;
	onClearSearchHistory: () => void;
}

export const HeaderTop: React.FC<HeaderTopProps> = ({
	isScrolled,
	searchValue,
	onChangeSearchValue,
	searchHistory,
	searchedSpareParts,
	isFetching,
	onClickSignIn,
	onClickLogout,
	onOpenMobileSearch,
	onOpenMobileContacts,
	onSearchSelect,
	onDeleteSearchHistory,
	onClearSearchHistory
}) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const searchRefContainer = useRef<HTMLDivElement>(null);

	useOutsideClick(searchRefContainer, () => setOpen(false));

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		onChangeSearchValue(value);
		setOpen(value.length > 2);
	};

	const handleInputFocus = () => {
		if (searchValue.length > 2) {
			setOpen(true);
		}
	};

	const handleSearchSelect = (item: SparePart) => {
		onSearchSelect(item);
		setOpen(false);
	};

	return (
		<Box
			display='flex'
			mb={{ xs: 0, md: isScrolled ? 0 : 1 }}
			gap={2}
			alignItems='center'
			justifyContent={{ xs: 'space-between', md: 'initial' }}
		>
			<Link href='/'>
				<Box width={170} height={40} bgcolor='gray' display='flex' alignItems='center' justifyContent='center'>
					Logo
				</Box>
			</Link>

			<CatalogCategories />

			<Box ref={searchRefContainer} display={{ xs: 'none', md: 'flex' }} flex={1} position='relative'>
				<Input
					sx={{ pl: 1 }}
					onFocus={handleInputFocus}
					size='medium'
					startAdornment={<SearchIcon />}
					value={searchValue}
					placeholder='Поиск запчастей'
					fullWidth
					onChange={handleInputChange}
				/>

				{open && (
					<WhiteBox
						borderRadius={1}
						px={2}
						py={1}
						sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000 }}
					>
						<SearchHistoryChips
							searchHistory={searchHistory}
							onSearchHistoryClick={onChangeSearchValue}
							onDeleteSearchHistory={onDeleteSearchHistory}
							onClearSearchHistory={onClearSearchHistory}
						/>
						{isFetching && <Loader />}
						{searchValue.length > 2 && (
							<SearchResults
								searchedSpareParts={searchedSpareParts}
								searchValue={searchValue}
								isFetching={isFetching}
								onSearchSelect={handleSearchSelect}
							/>
						)}
					</WhiteBox>
				)}
			</Box>

			<Box display={'flex'} sx={{ display: { xs: 'none', md: 'flex' } }}>
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

			<Box alignItems={'center'} gap={0.5} sx={{ display: { xs: 'flex', md: 'none' } }}>
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
