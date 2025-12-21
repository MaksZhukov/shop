import { Button, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { Typography } from 'shared/ui';
import { useState } from 'react';
import { ChevronDownIcon, OptionsIcon } from 'shared/icons';
import { SEO } from 'shared/api/types';

type SortItem = {
	value: string;
	name: string;
};

const SORT_ITEMS: SortItem[] = [
	{ value: 'createdAt:desc', name: 'Новые' },
	{ value: 'createdAt:asc', name: 'Старые' },
	{ value: 'price:asc', name: 'Дешёвые' },
	{ value: 'price:desc', name: 'Дорогие' }
];

interface CatalogHeaderProps {
	seo: SEO | null;
	sort: string;
	total: number | null;
	onChangeSort: (sort: string) => void;
	onOpenFiltersModal: () => void;
}

export const CatalogHeader: React.FC<CatalogHeaderProps> = ({ seo, sort, total, onChangeSort, onOpenFiltersModal }) => {
	const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setSortMenuAnchor(event.currentTarget);
	};

	const handleSortMenuClose = () => {
		setSortMenuAnchor(null);
	};

	const handleSortItemClick = (item: SortItem) => {
		setSortMenuAnchor(null);
		onChangeSort(item.value);
	};

	return (
		<Box
			display='flex'
			flexDirection={{ xs: 'column', md: 'row' }}
			justifyContent='space-between'
			mb={{ xs: 2, md: 0 }}
			alignItems={{ xs: 'flex-start', md: 'center' }}
		>
			<Typography mb={1} variant='h6'>
				{seo?.h1}
			</Typography>
			<Button
				sx={{ display: { xs: 'flex', md: 'none' } }}
				fullWidth
				startIcon={<OptionsIcon />}
				variant='outlined'
				color='primary'
				onClick={onOpenFiltersModal}
			>
				Параметры поиска
			</Button>
			<Box
				mt={{ xs: 1, md: 0 }}
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				width={{ xs: '100%', md: 'auto' }}
			>
				<Box display={{ xs: 'flex', md: 'none' }} gap={0.5}>
					<Typography color='custom.text-muted'> Всего запчастей: </Typography>
					<Typography fontWeight={500}>{total?.toLocaleString()}</Typography>
				</Box>
				<Button variant='text' endIcon={<ChevronDownIcon />} color='primary' onClick={handleSortMenuOpen}>
					{SORT_ITEMS.find((item) => item.value === sort)?.name}
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
							selected={sort === item.value}
						>
							{item.name}
						</MenuItem>
					))}
				</Menu>
			</Box>
		</Box>
	);
};
