import { Box, Button, Popover, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Link } from 'shared/ui';
import { ChevronRightIcon, CloseIcon, MenuIcon } from 'shared/icons';
import { useQuery } from '@tanstack/react-query';
import { catalogApi, TopCategory } from 'entities/catalog';

export const CatalogCategories: React.FC = () => {
	const theme = useTheme();
	const router = useRouter();
	const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
	const [hoveredCategory, setHoveredCategory] = useState<TopCategory | null>(null);
	const [catalogAnchorEl, setCatalogAnchorEl] = useState<HTMLElement | null>(null);
	const catalogOpen = Boolean(catalogAnchorEl);

	const handleCatalogClick = (event: React.MouseEvent<HTMLElement>) => {
		if (isMobile) {
			router.push('/mobile-catalog');
			return;
		}
		setCatalogAnchorEl(event.currentTarget);
	};

	const handleCatalogClose = () => {
		setCatalogAnchorEl(null);
	};

	const { data: topCategories } = useQuery({
		queryKey: ['catalogTopCategories'],
		enabled: catalogOpen,
		placeholderData: (prev) => prev,
		queryFn: () => catalogApi.fetchTopCategories()
	});

	useEffect(() => {
		if (topCategories?.data.data && topCategories.data.data.length > 0) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setHoveredCategory(topCategories.data.data[0]);
		}
	}, [topCategories]);

	return (
        <>
            <Button
				sx={{
					display: 'flex',
					flexShrink: 0,
					letterSpacing: '0.02em',
					px: { xs: 1.25, sm: 1.5, md: 2 },
					py: { xs: 1, md: 1.25 },
					minWidth: 'auto',
					whiteSpace: 'nowrap'
				}}
				size='medium'
				startIcon={!isMobile && catalogOpen ? <CloseIcon /> : <MenuIcon />}
				variant='contained'
				color='primary'
				onClick={handleCatalogClick}
				aria-expanded={catalogOpen ? 'true' : undefined}
				aria-haspopup='true'
			>
				<Typography
					component='span'
					sx={{
						fontWeight: 600,
						typography: { xs: 'caption', sm: 'body2', md: 'body1' }
					}}
				>
					КАТАЛОГ
				</Typography>
			</Button>
            {!isMobile && (
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
				<Box
                    sx={{
                        bgcolor: 'background.paper',
                        minHeight: '900px',
                        display: 'flex',
                        p: 2
                    }}>
					<Box
                        sx={{
                            width: '256px',
                            p: 1,
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
						<Typography variant='h6' sx={{ fontWeight: 700 }}>
							Каталог
						</Typography>
						{topCategories?.data.data.map((category) => (
							<Box
                                key={category.name}
                                onMouseEnter={() => {
									setHoveredCategory(category);
								}}
                                sx={{
                                    bgcolor: hoveredCategory === category ? 'custom.bg-surface-3' : 'transparent',
                                    p: 1,
                                    borderRadius: 2,
                                    display: 'flex',
                                    gap: 0.5,
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    ':hover': { bgcolor: 'custom.bg-surface-3' }
                                }}>
								<Typography variant='body1' sx={{ fontWeight: 500 }}>
									{category.name}
								</Typography>
								<Typography variant='body1' color='custom.text-muted' sx={{ flex: 1 }}>
									{category.totalSparePartsCount?.toLocaleString()}
								</Typography>
								<Box>
									<ChevronRightIcon></ChevronRightIcon>
								</Box>
							</Box>
						))}
					</Box>
					<Box
                        sx={{
                            minWidth: '1000px',
                            maxHeight: '500px',
                            borderRadius: 4,
                            bgcolor: 'custom.bg-surface-1',
                            p: 2
                        }}>
						<Typography variant='h6' sx={{ fontWeight: 700 }}>
							{hoveredCategory?.name}
						</Typography>
						<Box
                            sx={{
                                maxHeight: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                flexWrap: 'wrap'
                            }}>
							{hoveredCategory?.kindSpareParts.map((item) => (
								<Box
                                    onClick={handleCatalogClose}
                                    key={item.id}
                                    sx={{
                                        display: 'flex',
                                        gap: 0.5,
                                        py: 1
                                    }}>
									<Link href={`/spare-parts/ksp-${item.slug}`}>{item.name}</Link>
									<Typography variant='body2' color='custom.text-muted'>
										{item.spareParts.count?.toLocaleString()}
									</Typography>
								</Box>
							))}
						</Box>
					</Box>
				</Box>
			</Popover>
			)}
        </>
    );
};
