import { AppBar, Container } from '@mui/material';
import router, { useRouter } from 'next/router';
import { type ReactNode, useState } from 'react';
import { reatomComponent } from '@reatom/react';
import { useSearchSpareParts, useAuthModal, useMobileModals, useSearchHistory } from '../hooks';
import { HeaderMainBar, HeaderMobileMenuModal, HeaderMobileUtilityBar, HeaderUtilityBar } from '../ui';
import type { SparePart } from 'entities/sparePart';
import type { Filters } from 'shared/api/types';

type HeaderProps = {
	searchPlaceholder: string;
	catalogFilters: Filters;
	workTimetable: ReactNode;
	workTimetableCompact: ReactNode;
	renderAuthModal: (props: {
		isResetPassword: boolean;
		onChangeModalOpened: (opened: boolean) => void;
		onLoginSuccess: () => void | Promise<void>;
	}) => ReactNode;
	onLoginSuccess: () => void | Promise<void>;
	logout: () => void;
	clearFavorites: () => void;
	loadFavorites: () => void | Promise<unknown>;
};

export const Header = reatomComponent<HeaderProps>(({
	searchPlaceholder,
	catalogFilters,
	workTimetable,
	workTimetableCompact,
	renderAuthModal,
	onLoginSuccess,
	logout,
	clearFavorites,
	loadFavorites
}) => {
	const { code } = useRouter().query;
	const isResetPassword = !!code;
	const [searchValue, setSearchValue] = useState<string>('');
	const { searchedSpareParts, isFetching } = useSearchSpareParts(searchValue, catalogFilters);
	const { isOpenedAuthModal, setIsOpenedAuthModal, handleClickSignIn, handleClickLogout } = useAuthModal(
		isResetPassword,
		{ logout, clearFavorites, loadFavorites }
	);

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
			<AppBar
				sx={{
					py: { xs: 1.5, md: 2 },
					borderBottom: '1px solid',
					borderColor: 'primary.main'
				}}
				color='secondary'
				position='fixed'
			>
				<Container>
					<HeaderUtilityBar workTimetable={workTimetable} />
					<HeaderMobileUtilityBar onOpenMenu={handleOpenMobileMenu} workTimetable={workTimetableCompact} />
					<HeaderMainBar
						searchPlaceholder={searchPlaceholder}
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

			{isOpenedAuthModal &&
				renderAuthModal({
					isResetPassword,
					onChangeModalOpened: setIsOpenedAuthModal,
					onLoginSuccess
				})}
		</>
	);
});
