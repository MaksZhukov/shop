import { Box, Button, Popover, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'shared/ui';
import { DashboardFilledIcon, ChevronRightIcon, CloseIcon } from 'shared/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchTopCategories } from 'api/catalog/catalog';
import { TopCategory } from 'api/catalog/types';

export const CatalogCategories: React.FC = () => {
	const [hoveredCategory, setHoveredCategory] = useState<TopCategory | null>(null);
	const [catalogAnchorEl, setCatalogAnchorEl] = useState<HTMLElement | null>(null);
	const catalogOpen = Boolean(catalogAnchorEl);

	const handleCatalogClick = (event: React.MouseEvent<HTMLElement>) => {
		setCatalogAnchorEl(event.currentTarget);
	};

	const handleCatalogClose = () => {
		setCatalogAnchorEl(null);
	};

	const { data: topCategories } = useQuery({
		queryKey: ['catalogTopCategories'],
		enabled: catalogOpen,
		placeholderData: (prev) => prev,
		queryFn: () => fetchTopCategories()
	});

	useEffect(() => {
		if (topCategories?.data.data && topCategories.data.data.length > 0) {
			setHoveredCategory(topCategories.data.data[0]);
		}
	}, [topCategories]);

	return (
		<>
			<Button
				sx={{ display: { xs: 'none', md: 'flex' } }}
				size='medium'
				startIcon={catalogOpen ? <CloseIcon /> : <DashboardFilledIcon />}
				variant='contained'
				color='primary'
				onClick={handleCatalogClick}
				aria-expanded={catalogOpen ? 'true' : undefined}
				aria-haspopup='true'
			>
				Каталог
			</Button>

			<Popover
				disableScrollLock={true}
				open={catalogOpen}
				anchorEl={catalogAnchorEl}
				onClose={handleCatalogClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left'
				}}
			>
				<Box bgcolor='background.paper' minHeight={'900px'} display='flex' p={2}>
					<Box width={'256px'} p={1} display='flex' flexDirection='column'>
						<Typography variant='h6' fontWeight={700} fontSize={18}>
							Каталог
						</Typography>
						{topCategories?.data.data.map((category) => (
							<Box
								bgcolor={hoveredCategory === category ? 'custom.bg-surface-3' : 'transparent'}
								sx={{ cursor: 'pointer', ':hover': { bgcolor: 'custom.bg-surface-3' } }}
								p={1}
								borderRadius={2}
								key={category.name}
								display='flex'
								gap={0.5}
								alignItems='center'
								onMouseEnter={() => {
									setHoveredCategory(category);
								}}
							>
								<Typography variant='body1' fontWeight={500}>
									{category.name}
								</Typography>
								<Typography flex={1} variant='body1' color='custom.text-muted'>
									{category.totalSparePartsCount?.toLocaleString()}
								</Typography>
								<Box>
									<ChevronRightIcon></ChevronRightIcon>
								</Box>
							</Box>
						))}
					</Box>
					<Box minWidth={'1000px'} maxHeight={'500px'} borderRadius={4} bgcolor='custom.bg-surface-1' p={2}>
						<Typography variant='h6' fontWeight={700} fontSize={18}>
							{hoveredCategory?.name}
						</Typography>
						<Box
							maxHeight={'100%'}
							display='flex'
							flexDirection='column'
							justifyContent='flex-start'
							flexWrap='wrap'
						>
							{hoveredCategory?.kindSpareParts.map((item) => (
								<Box key={item.id} display='flex' gap={0.5} py={1}>
									<Link href={`/spare-parts?kindSparePart=${item.slug}`}>{item.name}</Link>
									<Typography color='custom.text-muted'>
										{item.spareParts.count?.toLocaleString()}
									</Typography>
								</Box>
							))}
						</Box>
					</Box>
				</Box>
			</Popover>
		</>
	);
};
