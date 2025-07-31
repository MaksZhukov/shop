import { AppBar, Container, useTheme } from '@mui/material';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useHeaderScroll, useSearchSpareParts, useAuthModal, useMobileModals } from './hooks';
import { HeaderTop, HeaderBottom, MobileBottomNav, MobileSearchModal, MobileContactsModal } from './components';
import ModalAuth from 'components/ModalAuth';

interface Props {}

const Header = observer(({}: Props) => {
	const theme = useTheme();
	const { code } = useRouter().query;
	const [searchValue, setSearchValue] = useState<string>('');

	const { isScrolled } = useHeaderScroll();
	const { searchedSpareParts, isFetching } = useSearchSpareParts(searchValue);
	const { isOpenedAuthModal, setIsOpenedAuthModal, handleClickSignIn, handleClickLogout } = useAuthModal();
	const {
		isOpenedMobileContacts,
		setIsOpenedMobileContacts,
		isOpenedMobileSearch,
		setIsOpenedMobileSearch,
		handleCloseMobileSearch
	} = useMobileModals();

	return (
		<>
			<AppBar sx={{ py: theme.spacing(2) }} color='secondary' position='fixed'>
				<Container>
					<HeaderTop
						isScrolled={isScrolled}
						searchValue={searchValue}
						setSearchValue={setSearchValue}
						searchedSpareParts={searchedSpareParts}
						isFetching={isFetching}
						onClickSignIn={handleClickSignIn}
						onClickLogout={handleClickLogout}
						onOpenMobileSearch={() => setIsOpenedMobileSearch(true)}
						onOpenMobileContacts={() => setIsOpenedMobileContacts(true)}
					/>

					<HeaderBottom isScrolled={isScrolled} />
				</Container>
			</AppBar>

			<MobileSearchModal
				isOpened={isOpenedMobileSearch}
				onClose={handleCloseMobileSearch}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				searchedSpareParts={searchedSpareParts}
				isFetching={isFetching}
			/>

			<MobileContactsModal isOpened={isOpenedMobileContacts} onClose={() => setIsOpenedMobileContacts(false)} />

			<MobileBottomNav onClickSignIn={handleClickSignIn} onClickLogout={handleClickLogout} />

			{isOpenedAuthModal && <ModalAuth isResetPassword={!!code} onChangeModalOpened={setIsOpenedAuthModal} />}
		</>
	);
});

export default Header;
