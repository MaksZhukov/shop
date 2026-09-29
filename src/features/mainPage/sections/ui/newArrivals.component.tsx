import { Box } from '@mui/material';
import { type SparePart } from 'entities/sparePart';
import { Button } from 'shared/ui';
import { ChevronRightIcon } from 'shared/icons';
import { Typography, Carousel } from 'shared/ui';
import { ProductItem } from 'entities/product';
import type { ReactNode } from 'react';
import { mainPageQueryKeys, mainPageQueryFns } from 'features/mainPage';
import { useDI } from '../../mainPage.di';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from 'shared/api';

interface NewArrivalsProps {
	renderHeaderActions: (product: SparePart) => ReactNode;
	renderBottomActions: (product: SparePart) => ReactNode;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ renderHeaderActions, renderBottomActions }) => {
	const { sparePartService } = useDI();
	const { data: newSparePartsRes } = useQuery({
		queryKey: mainPageQueryKeys.newSpareParts(),
		queryFn: () => mainPageQueryFns.newSpareParts(sparePartService),
		select: (res: ApiResponse<SparePart[]>) => res.data
	});
	const newSpareParts = newSparePartsRes ?? [];
	return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    mb: 1
                }}>
				<Box
                    sx={{
                        flex: 1,
                        textAlign: { xs: 'center', md: 'left' }
                    }}>
					<Typography variant='h6'>Новое поступление</Typography>
					<Typography color='text.primary' variant='body2'>
						Смотреть все Все запчасти находятся на складе и готовы к оперативной отправке
					</Typography>
				</Box>
				<Button
					sx={{ display: { xs: 'none', md: 'flex' } }}
					variant='link'
					href='/spare-parts'
					endIcon={<ChevronRightIcon />}
				>
					Смотреть все
				</Button>
			</Box>
            <Box sx={{
                mb: 5
            }}>
				<Carousel carouselContainerSx={{ ml: -1 }} showDots={false}>
					{newSpareParts.map((item) => (
						<Box
                            key={item.id}
                            sx={{
                                width: { xs: '100%', md: '50%', lg: '25%' },
                                pl: 1
                            }}>
							<ProductItem
								data={item}
								width={342}
								headerActions={renderHeaderActions(item)}
								bottomActions={renderBottomActions(item)}
							></ProductItem>
						</Box>
					))}
				</Carousel>
			</Box>
        </>
    );
};
