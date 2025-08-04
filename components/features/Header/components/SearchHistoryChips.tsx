import { Box, Button, Chip, IconButton, Typography } from '@mui/material';
import React from 'react';
import { CloseIcon } from 'components/icons';

interface SearchHistoryChipsProps {
	searchHistory: string[];
	onSearchHistoryClick: (value: string) => void;
	onDeleteSearchHistory: (value: string) => void;
	onClearSearchHistory: () => void;
	showClearButton?: boolean;
	mb?: number;
}

export const SearchHistoryChips: React.FC<SearchHistoryChipsProps> = ({
	searchHistory,
	onSearchHistoryClick,
	onDeleteSearchHistory,
	onClearSearchHistory,
	showClearButton = true,
	mb = 1
}) => {
	if (!searchHistory.length) {
		return null;
	}

	const handleSearchHistoryClick = (value: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
		onSearchHistoryClick(value);
	};

	const handleDeleteSearchHistory = (value: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
		onDeleteSearchHistory(value);
	};
	return (
		<>
			<Box display='flex' justifyContent='space-between' gap={1}>
				<Typography color='custom.text-muted'>История</Typography>
				{showClearButton && (
					<Button color='info' variant='text' size='small' onClick={onClearSearchHistory}>
						Очистить
					</Button>
				)}
			</Box>
			<Box display='flex' mb={mb} flexWrap='wrap' gap={0.5}>
				{searchHistory.map((item) => (
					<Chip
						key={item}
						color='primary'
						component='button'
						onClick={handleSearchHistoryClick(item)}
						onDelete={handleDeleteSearchHistory(item)}
						deleteIcon={
							<IconButton size='small'>
								<CloseIcon />
							</IconButton>
						}
						label={item}
					/>
				))}
			</Box>
		</>
	);
};
