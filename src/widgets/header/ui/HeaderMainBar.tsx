import { Box } from '@mui/material';
import { FC } from 'react';
import { BrandLogo } from 'shared/ui';
import type { SparePart } from 'entities/sparePart';
import { CatalogCategories } from './CatalogCategories';
import { HeaderMobileUserActions } from './HeaderMobileUserActions';
import { HeaderSearch } from './HeaderSearch';
import { HeaderUserActions } from './HeaderUserActions';

interface HeaderMainBarProps {
	searchValue: string;
	onChangeSearchValue: (value: string) => void;
	searchHistory: string[];
	searchedSpareParts: SparePart[];
	isFetching: boolean;
	onClickSignIn: () => void;
	onClickLogout: () => void;
	onSearchSelect: (item: SparePart) => void;
	onDeleteSearchHistory: (value: string) => void;
	onClearSearchHistory: () => void;
}

const searchProps = (
	props: HeaderMainBarProps
): Pick<
	HeaderMainBarProps,
	| 'searchValue'
	| 'onChangeSearchValue'
	| 'searchHistory'
	| 'searchedSpareParts'
	| 'isFetching'
	| 'onSearchSelect'
	| 'onDeleteSearchHistory'
	| 'onClearSearchHistory'
> => ({
	searchValue: props.searchValue,
	onChangeSearchValue: props.onChangeSearchValue,
	searchHistory: props.searchHistory,
	searchedSpareParts: props.searchedSpareParts,
	isFetching: props.isFetching,
	onSearchSelect: props.onSearchSelect,
	onDeleteSearchHistory: props.onDeleteSearchHistory,
	onClearSearchHistory: props.onClearSearchHistory
});

export const HeaderMainBar: FC<HeaderMainBarProps> = (props) => {
	const { onClickSignIn, onClickLogout } = props;

	return (
		<>
			<Box
				sx={{
					display: { xs: 'none', lg: 'flex' },
					gap: 2,
					alignItems: 'center'
				}}
			>
				<BrandLogo sx={{ flexShrink: 0 }} />
				<CatalogCategories />
				<HeaderSearch {...searchProps(props)} />
				<HeaderUserActions onClickSignIn={onClickSignIn} onClickLogout={onClickLogout} />
			</Box>

			<Box
				sx={{
					display: { xs: 'flex', lg: 'none' },
					flexDirection: 'column',
					gap: 1.5,
					pt: 1.5,
					width: '100%',
					minWidth: 0
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 1,
						minWidth: 0,
						position: 'relative',
						zIndex: 1,
						pb: { xs: 1.5, sm: 0 },
						borderBottom: { xs: '1px solid', sm: 'none' },
						borderColor: 'custom.divider'
					}}
				>
					<BrandLogo compact sx={{ flexShrink: 1, minWidth: 0 }} />
					<Box sx={{ display: { xs: 'flex', sm: 'none' }, flexShrink: 0 }}>
						<HeaderMobileUserActions onClickSignIn={onClickSignIn} onClickLogout={onClickLogout} />
					</Box>
					<Box sx={{ display: { xs: 'none', sm: 'flex' }, flexShrink: 0 }}>
						<HeaderUserActions onClickSignIn={onClickSignIn} onClickLogout={onClickLogout} />
					</Box>
				</Box>

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: { xs: 1, sm: 1.5 },
						width: '100%',
						minWidth: 0
					}}
				>
					<CatalogCategories />
					<HeaderSearch {...searchProps(props)} />
				</Box>
			</Box>
		</>
	);
};
