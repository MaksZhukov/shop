import { Box } from '@mui/material';
import { FC } from 'react';
import { BrandLogo } from 'shared/ui';
import type { SparePart } from 'entities/sparePart';
import {
	headerMainBarDesktopSx,
	headerMainBarMobileCatalogRowSx,
	headerMainBarMobileLogoRowSx,
	headerMainBarMobileSx
} from '../lib/headerMainBarSx';
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
			<Box sx={headerMainBarDesktopSx}>
				<BrandLogo sx={{ flexShrink: 0 }} />
				<CatalogCategories />
				<HeaderSearch {...searchProps(props)} />
				<HeaderUserActions onClickSignIn={onClickSignIn} onClickLogout={onClickLogout} />
			</Box>

			<Box sx={headerMainBarMobileSx}>
				<Box sx={headerMainBarMobileLogoRowSx}>
					<BrandLogo compact sx={{ flexShrink: 1, minWidth: 0 }} />
					<Box sx={{ display: { xs: 'flex', sm: 'none' }, flexShrink: 0 }}>
						<HeaderMobileUserActions onClickSignIn={onClickSignIn} onClickLogout={onClickLogout} />
					</Box>
					<Box sx={{ display: { xs: 'none', sm: 'flex' }, flexShrink: 0 }}>
						<HeaderUserActions onClickSignIn={onClickSignIn} onClickLogout={onClickLogout} />
					</Box>
				</Box>

				<Box sx={headerMainBarMobileCatalogRowSx}>
					<CatalogCategories />
					<HeaderSearch {...searchProps(props)} />
				</Box>
			</Box>
		</>
	);
};
