import { AppBar, Container, useTheme } from '@mui/material';
import router, { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { observer } from 'mobx-react';
import { useHeaderScroll, useSearchSpareParts, useAuthModal, useMobileModals, useSearchHistory } from '../hooks';
import { HeaderTop, HeaderBottom, MobileBottomNav, MobileSearchModal, MobileContactsModal } from '../ui';
import { ModalAuth } from 'features/user';
import { useLoadCart } from 'features/cart';
import { useLoadFavorites } from 'features/favorites';
import type { SparePart } from 'entities/sparePart';

export const Header: FC = observer(() => {
	const theme = useTheme();
	const { code } = useRouter().query;
	const isResetPassword = !!code;
	const [searchValue, setSearchValue] = useState<string>('');
	const { isScrolled } = useHeaderScroll();
	const { searchedSpareParts, isFetching } = useSearchSpareParts(searchValue);
	const { isOpenedAuthModal, setIsOpenedAuthModal, handleClickSignIn, handleClickLogout } =
		useAuthModal(isResetPassword);
	const loadCart = useLoadCart();
	const loadFavorites = useLoadFavorites();

	const handleLoginSuccess = async () => {
		await Promise.all([loadCart(), loadFavorites()]);
	};
	const {
		isOpenedMobileContacts,
		setIsOpenedMobileContacts,
		isOpenedMobileSearch,
		setIsOpenedMobileSearch,
		handleCloseMobileSearch
	} = useMobileModals();
	const { searchHistory, setSearchHistory, deleteSearchHistory, addToSearchHistory, clearSearchHistory } =
		useSearchHistory();

	const handleDeleteSearchHistory = (value: string) => {
		deleteSearchHistory(value);
	};

	const handleSearchSelectWithValue = (item: SparePart) => {
		addToSearchHistory(searchValue);
		router.push(`/spare-parts/${item.brand?.slug}/${item.slug}`);
		setSearchValue('');
		setIsOpenedMobileSearch(false);
	};

	const handleCloseMobileContacts = () => {
		setIsOpenedMobileContacts(false);
	};

	const handleOpenMobileSearch = () => {
		setIsOpenedMobileSearch(true);
	};

	const handleOpenMobileContacts = () => {
		setIsOpenedMobileContacts(true);
	};

	const searchedSparePartsData = searchedSpareParts?.data?.data || [];

	return (
		<>
			<AppBar sx={{ py: theme.spacing(2) }} color='secondary' position='fixed'>
				<Container>
					<HeaderTop
						isScrolled={isScrolled}
						searchValue={searchValue}
						onChangeSearchValue={setSearchValue}
						searchHistory={searchHistory}
						searchedSpareParts={searchedSparePartsData}
						isFetching={isFetching}
						onClickSignIn={handleClickSignIn}
						onClickLogout={handleClickLogout}
						onDeleteSearchHistory={handleDeleteSearchHistory}
						onClearSearchHistory={clearSearchHistory}
						onSearchSelect={handleSearchSelectWithValue}
						onOpenMobileSearch={handleOpenMobileSearch}
						onOpenMobileContacts={handleOpenMobileContacts}
					/>

					<HeaderBottom isScrolled={isScrolled} />
				</Container>
			</AppBar>

			<MobileSearchModal
				isOpened={isOpenedMobileSearch}
				onClose={handleCloseMobileSearch}
				searchValue={searchValue}
				onChangeSearchValue={setSearchValue}
				searchHistory={searchHistory}
				onSearchSelect={handleSearchSelectWithValue}
				setSearchHistory={setSearchHistory}
				searchedSpareParts={searchedSparePartsData}
				isFetching={isFetching}
				onDeleteSearchHistory={handleDeleteSearchHistory}
				onClearSearchHistory={clearSearchHistory}
			/>

			<MobileContactsModal isOpened={isOpenedMobileContacts} onClose={handleCloseMobileContacts} />

			<MobileBottomNav onClickSignIn={handleClickSignIn} onClickLogout={handleClickLogout} />

			{isOpenedAuthModal && (
				<ModalAuth
					isResetPassword={isResetPassword}
					onChangeModalOpened={setIsOpenedAuthModal}
					onLoginSuccess={handleLoginSuccess}
				/>
			)}
		</>
	);
});
