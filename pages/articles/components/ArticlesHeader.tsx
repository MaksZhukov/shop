import { Box, Button, Menu, MenuItem } from '@mui/material';
import { Typography } from 'components/ui';
import { ChevronDownIcon } from 'components/icons';
import { useState } from 'react';
import { SortItem } from '../types';
import { SORT_ITEMS } from '../constants';

const useSortMenu = () => {
	const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);

	const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setSortMenuAnchor(event.currentTarget);
	};

	const handleSortMenuClose = () => {
		setSortMenuAnchor(null);
	};

	return {
		sortMenuAnchor,
		handleSortMenuOpen,
		handleSortMenuClose
	};
};

interface ArticlesHeaderProps {
	currentSort: string;
	onSortChange: (sort: string) => void;
}

const ArticlesHeader = ({ currentSort, onSortChange }: ArticlesHeaderProps) => {
	const { sortMenuAnchor, handleSortMenuOpen, handleSortMenuClose } = useSortMenu();

	const handleSortItemClick = (item: SortItem) => {
		handleSortMenuClose();
		onSortChange(item.value);
	};

	const currentSortName = SORT_ITEMS.find((item) => item.value === currentSort)?.name;

	return (
		<Box display='flex' justifyContent='space-between' alignItems='center'>
			<Typography variant='h6' component='h1' marginBottom='1em'>
				Новости авторазборки
			</Typography>
			<Button variant='text' endIcon={<ChevronDownIcon />} color='primary' onClick={handleSortMenuOpen}>
				{currentSortName}
			</Button>
			<Menu
				disableScrollLock
				sx={{
					'& .MuiPaper-root': {
						bgcolor: 'background.paper',
						mt: -0.5
					}
				}}
				anchorEl={sortMenuAnchor}
				open={Boolean(sortMenuAnchor)}
				onClose={handleSortMenuClose}
			>
				{SORT_ITEMS.map((item) => (
					<MenuItem
						key={item.name}
						onClick={() => handleSortItemClick(item)}
						selected={currentSort === item.value}
					>
						{item.name}
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
};

export default ArticlesHeader;
