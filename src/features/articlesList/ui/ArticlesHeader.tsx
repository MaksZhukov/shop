import { Box, Button, Menu, MenuItem, useMediaQuery } from '@mui/material';
import { Typography } from 'shared/ui';
import { ChevronDownIcon } from 'shared/icons';
import { useState } from 'react';
import { SORT_ITEMS } from '../model';
import type { SortItem } from '../articlesListTypes';

interface ArticlesHeaderProps {
	currentSort: string;
	onSortChange: (sort: string) => void;
}

export const ArticlesHeader = ({ currentSort, onSortChange }: ArticlesHeaderProps) => {
	const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);

	const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setSortMenuAnchor(event.currentTarget);
	};

	const handleSortMenuClose = () => {
		setSortMenuAnchor(null);
	};

	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

	const handleSortItemClick = (item: SortItem) => {
		handleSortMenuClose();
		onSortChange(item.value);
	};

	const currentSortName = SORT_ITEMS.find((item) => item.value === currentSort)?.name;

	return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1
            }}>
            <Typography variant='h6' component='h1'>
				{isMobile ? 'Новости' : 'Новости авторазборки'}
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
