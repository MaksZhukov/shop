import { Box, IconButton, InputBase, useMediaQuery, useTheme } from '@mui/material';
import { useRef } from 'react';
import { reatomComponent } from '@reatom/react';
import { useOutsideClick } from 'rooks';
import { SearchIcon } from 'shared/icons';
import { Loader, WhiteBox } from 'shared/ui';
import { useDI } from '../../header.di';
import { HEADER_SEARCH_PLACEHOLDER_SHORT } from '../search.constants';
import {
	headerSearchButtonSx,
	headerSearchContainerSx,
	headerSearchInputSx
} from '../lib/headerSearchSx';
import { SearchHistoryChips } from './searchHistoryChips.component';
import { SearchResults } from './searchResults.component';

export const HeaderSearch = reatomComponent(() => {
	const { headerSearchStore } = useDI();
	const searchRefContainer = useRef<HTMLDivElement>(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const placeholder = isMobile ? HEADER_SEARCH_PLACEHOLDER_SHORT : headerSearchStore.placeholder();
	const searchValue = headerSearchStore.searchValue();
	const isFetching = !headerSearchStore.searchResults.ready();

	// The header renders a desktop and a mobile copy; the copy hidden by CSS must not close the shared dropdown.
	useOutsideClick(searchRefContainer, () => {
		if (searchRefContainer.current?.offsetParent) {
			headerSearchStore.isDropdownOpened.setFalse();
		}
	});

	return (
		<Box
			ref={searchRefContainer}
			sx={{
				display: 'flex',
				flex: 1,
				position: 'relative',
				minWidth: 0
			}}
		>
			<Box sx={headerSearchContainerSx}>
				<InputBase
					value={searchValue}
					onChange={(event) => headerSearchStore.changeSearchValue(event.target.value)}
					onFocus={() => headerSearchStore.focus()}
					placeholder={placeholder}
					fullWidth
					size='small'
					sx={headerSearchInputSx}
				/>
				<IconButton aria-label='Поиск' sx={headerSearchButtonSx}>
					<SearchIcon />
				</IconButton>
			</Box>

			{headerSearchStore.isDropdownOpened() && (
				<WhiteBox
					sx={{
						borderRadius: 1,
						px: 2,
						py: 1,
						position: 'absolute',
						top: 'calc(100% + 4px)',
						left: 0,
						right: 0,
						zIndex: 1000
					}}
				>
					<SearchHistoryChips
						searchHistory={headerSearchStore.searchHistory()}
						onSearchHistoryClick={(value) => headerSearchStore.changeSearchValue(value)}
						onDeleteSearchHistory={(value) => headerSearchStore.deleteSearchHistory(value)}
						onClearSearchHistory={() => headerSearchStore.clearSearchHistory()}
					/>
					{isFetching && <Loader />}
					{headerSearchStore.hasQuery() && (
						<SearchResults
							searchedSpareParts={headerSearchStore.searchResults.data()}
							searchValue={searchValue}
							isFetching={isFetching}
							onSearchSelect={(item) => headerSearchStore.selectSearchResult(item)}
						/>
					)}
				</WhiteBox>
			)}
		</Box>
	);
});
