import { Box, Input, Modal } from '@mui/material';
import React from 'react';
import { ModalContainer } from 'components/ui';
import { SearchIcon } from 'components/icons';
import Loader from 'components/ui/Loader';
import { saveSearchHistory } from 'services/LocalStorageService';
import { SearchHistoryChips, SearchResults } from './';
import { SparePart } from 'api/spareParts/types';

interface MobileSearchModalProps {
	isOpened: boolean;
	onClose: () => void;
	searchValue: string;
	onChangeSearchValue: (value: string) => void;
	searchHistory: string[];
	setSearchHistory: (value: string[]) => void;
	searchedSpareParts: SparePart[];
	isFetching: boolean;
	onDeleteSearchHistory: (value: string) => void;
	onSearchSelect: (item: SparePart) => void;
	onClearSearchHistory: () => void;
}

export const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
	isOpened,
	onClose,
	searchValue,
	onChangeSearchValue,
	searchHistory,
	setSearchHistory,
	searchedSpareParts,
	isFetching,
	onDeleteSearchHistory,
	onSearchSelect,
	onClearSearchHistory
}) => {
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChangeSearchValue(event.target.value);
	};

	const handleClose = () => {
		onClose();
		onChangeSearchValue('');
	};

	return (
		<Modal open={isOpened} onClose={handleClose}>
			<ModalContainer
				px={2}
				py={1.5}
				onClose={handleClose}
				title={
					<Input
						sx={{ pl: 1 }}
						size='medium'
						startAdornment={<SearchIcon />}
						value={searchValue}
						placeholder='Быстрый поиск'
						fullWidth
						onChange={handleInputChange}
					/>
				}
				width={'calc(100% - 1em)'}
				sx={{ mx: 1, my: 1, height: 'calc(100vh - 1em)', position: 'relative' }}
			>
				<Box position='relative'>
					<Box mt={2}>
						<SearchHistoryChips
							searchHistory={searchHistory}
							onSearchHistoryClick={onChangeSearchValue}
							onDeleteSearchHistory={onDeleteSearchHistory}
							onClearSearchHistory={onClearSearchHistory}
							mb={0}
						/>
					</Box>

					{isFetching && <Loader />}
					{searchValue.length > 2 && (
						<SearchResults
							searchedSpareParts={searchedSpareParts}
							searchValue={searchValue}
							isFetching={isFetching}
							onSearchSelect={onSearchSelect}
						/>
					)}
				</Box>
			</ModalContainer>
		</Modal>
	);
};
