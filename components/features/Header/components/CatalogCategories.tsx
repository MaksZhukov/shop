import { Box, Button, Popover, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'components/ui';
import { DashboardFilledIcon, ChevronRightIcon, CloseIcon } from 'components/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePartWithSparePartsCount } from 'api/kindSpareParts/types';

export const CatalogCategories: React.FC = () => {
	const [hoveredCategory, setHoveredCategory] = useState<any | null>(null);
	const [catalogAnchorEl, setCatalogAnchorEl] = useState<HTMLElement | null>(null);
	const catalogOpen = Boolean(catalogAnchorEl);

	const handleCatalogClick = (event: React.MouseEvent<HTMLElement>) => {
		setCatalogAnchorEl(event.currentTarget);
	};

	const handleCatalogClose = () => {
		setCatalogAnchorEl(null);
	};

	const { data: kindSpareParts } = useQuery({
		queryKey: ['catalogCategories'],
		enabled: catalogOpen,
		placeholderData: (prev) => prev,
		queryFn: () =>
			fetchKindSpareParts<KindSparePartWithSparePartsCount>({
				pagination: { limit: 10 },
				populate: { spareParts: { count: true } }
			})
	});

	const index = kindSpareParts?.data.data.findIndex((item: any) => item.id === hoveredCategory?.id) || 0;
	const { data: relatedKindSpareParts } = useQuery({
		queryKey: ['relatedCatalogCategories', index],
		enabled: !!hoveredCategory,
		placeholderData: (prev) => prev,
		queryFn: () =>
			fetchKindSpareParts({ pagination: { limit: index * 5 }, populate: { spareParts: { count: true } } })
	});

	useEffect(() => {
		if (kindSpareParts) {
			setHoveredCategory(kindSpareParts.data.data[0]);
		}
	}, [kindSpareParts]);

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
				<Box bgcolor='white' minHeight={'900px'} display='flex' p={2}>
					<Box width={'256px'} p={1} display='flex' flexDirection='column'>
						<Typography variant='h6' fontWeight={700} fontSize={18}>
							Каталог
						</Typography>
						{kindSpareParts?.data.data.map((item) => (
							<Box
								bgcolor={hoveredCategory === item ? '#E2E2E2' : 'transparent'}
								sx={{ cursor: 'pointer', ':hover': { bgcolor: '#E2E2E2' } }}
								p={1}
								borderRadius={2}
								key={item.id}
								display='flex'
								gap={0.5}
								alignItems='center'
								onMouseEnter={() => {
									setHoveredCategory(item);
								}}
							>
								<Typography variant='body1' fontWeight={500}>
									{item.name}
								</Typography>
								<Typography flex={1} variant='body1' color='custom.text-muted'>
									{item.spareParts.count?.toLocaleString()}
								</Typography>
								<Box>
									<ChevronRightIcon></ChevronRightIcon>
								</Box>
							</Box>
						))}
					</Box>
					<Box minWidth={'1000px'} maxHeight={'500px'} borderRadius={4} bgcolor='#F5F5F5' p={2}>
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
							{relatedKindSpareParts?.data.data.map((item: any) => (
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
