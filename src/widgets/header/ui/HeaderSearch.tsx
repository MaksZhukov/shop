import { Box, IconButton, InputBase, useMediaQuery, useTheme } from '@mui/material';
import { FC, useRef, useState } from 'react';
import { useOutsideClick } from 'rooks';
import { SearchIcon } from 'shared/icons';
import { Loader, WhiteBox } from 'shared/ui';
import type { SparePart } from 'entities/sparePart';
import { HEADER_SEARCH_PLACEHOLDER_SHORT } from '../headerConstants';
import { useHeaderSearchPlaceholder } from '../hooks/useHeaderSearchPlaceholder';
import {
	headerSearchButtonSx,
	headerSearchContainerSx,
	headerSearchInputSx
} from '../lib/headerSearchSx';
import { SearchHistoryChips } from './SearchHistoryChips';
import { SearchResults } from './SearchResults';

interface HeaderSearchProps {
	searchValue: string;
	onChangeSearchValue: (value: string) => void;
	searchHistory: string[];
	searchedSpareParts: SparePart[];
	isFetching: boolean;
	onSearchSelect: (item: SparePart) => void;
	onDeleteSearchHistory: (value: string) => void;
	onClearSearchHistory: () => void;
}

export const HeaderSearch: FC<HeaderSearchProps> = ({
	searchValue,
	onChangeSearchValue,
	searchHistory,
	searchedSpareParts,
	isFetching,
	onSearchSelect,
	onDeleteSearchHistory,
	onClearSearchHistory
}) => {
	const [open, setOpen] = useState(false);
	const searchRefContainer = useRef<HTMLDivElement>(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const fullPlaceholder = useHeaderSearchPlaceholder();
	const placeholder = isMobile ? HEADER_SEARCH_PLACEHOLDER_SHORT : fullPlaceholder;

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
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					placeholder={placeholder}
					fullWidth
					size='small'
					sx={headerSearchInputSx}
				/>
				<IconButton aria-label='Поиск' sx={headerSearchButtonSx}>
					<SearchIcon />
				</IconButton>
			</Box>

			{open && (
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
	);
};
