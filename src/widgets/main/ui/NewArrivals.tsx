import { Box } from '@mui/material';
import type { SparePart } from 'entities/sparePart';
import { Button } from 'shared/ui';
import { ChevronRightIcon } from 'shared/icons';
import { Typography, Carousel } from 'shared/ui';
import { ProductItem } from 'entities/product';
import { CartButton } from 'features/cart';
import { FavoriteButton } from 'features/favorites';
import { mainPageQueryKeys, mainPageQueryFns } from 'features/mainPage';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from 'shared/api';

export const NewArrivals: React.FC = () => {
	const { data: newSparePartsRes } = useQuery({
		queryKey: mainPageQueryKeys.newSpareParts(),
		queryFn: mainPageQueryFns.newSpareParts,
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
								headerActions={<FavoriteButton product={item} />}
								bottomActions={
									<CartButton
										product={item}
										sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }}
									/>
								}
							></ProductItem>
						</Box>
					))}
				</Carousel>
			</Box>
        </>
    );
};
