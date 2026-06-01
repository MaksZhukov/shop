import { AppBar, Container } from '@mui/material';
import router, { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { observer } from 'mobx-react';
import { useSearchSpareParts, useAuthModal, useMobileModals, useSearchHistory } from '../hooks';
import {
	HeaderMainBar,
	HeaderMobileMenuModal,
	HeaderMobileUtilityBar,
	HeaderUtilityBar
} from '../ui';
import { ModalAuth } from 'features/user';
import { useLoadCart } from 'features/cart';
import { useLoadFavorites } from 'features/favorites';
import type { SparePart } from 'entities/sparePart';

export const Header: FC = observer(() => {
	const { code } = useRouter().query;
	const isResetPassword = !!code;
	const [searchValue, setSearchValue] = useState<string>('');
	const { searchedSpareParts, isFetching } = useSearchSpareParts(searchValue);
	const { isOpenedAuthModal, setIsOpenedAuthModal, handleClickSignIn, handleClickLogout } =
		useAuthModal(isResetPassword);
	const loadCart = useLoadCart();
	const loadFavorites = useLoadFavorites();

	const handleLoginSuccess = async () => {
		await Promise.all([loadCart(), loadFavorites()]);
	};
	const { isOpenedMobileMenu, handleOpenMobileMenu, handleCloseMobileMenu } = useMobileModals();
	const { searchHistory, deleteSearchHistory, addToSearchHistory, clearSearchHistory } = useSearchHistory();

	const handleDeleteSearchHistory = (value: string) => {
		deleteSearchHistory(value);
	};

	const handleSearchSelectWithValue = (item: SparePart) => {
		addToSearchHistory(searchValue);
		router.push(`/spare-parts/${item.brand?.slug}/${item.slug}`);
		setSearchValue('');
	};

	const searchedSparePartsData = searchedSpareParts?.data?.data || [];

	return (
		<>
			<AppBar sx={{ py: { xs: 1.5, md: 2 } }} color='secondary' position='fixed'>
				<Container>
					<HeaderUtilityBar />
					<HeaderMobileUtilityBar onOpenMenu={handleOpenMobileMenu} />
					<HeaderMainBar
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
					/>
				</Container>
			</AppBar>

			<HeaderMobileMenuModal isOpened={isOpenedMobileMenu} onClose={handleCloseMobileMenu} />

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
