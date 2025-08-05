import { Box } from '@mui/material';
import { CarOnParts } from 'api/cars-on-parts/types';
import { Button } from 'components/ui';
import { ChevronRightIcon } from 'components/icons';
import { Typography } from 'components/ui';
import CarItem from 'components/CarItem';
import { Carousel } from 'components/ui';

interface CarsOnPartsProps {
	carsOnParts: CarOnParts[];
}

export const CarsOnParts: React.FC<CarsOnPartsProps> = ({ carsOnParts }) => {
	return (
		<>
			<Box display={'flex'} justifyContent={'space-between'} alignItems={'start'} mb={1}>
				<Box flex={1} textAlign={{ xs: 'center', md: 'left' }}>
					<Typography variant='h6'>Машины на разбор</Typography>
					<Typography textAlign={{ xs: 'center', md: 'left' }} color='text.primary' variant='body2'>
						Новые поступление машин на разбор
					</Typography>
				</Box>
				<Button
					sx={{ display: { xs: 'none', md: 'flex' } }}
					variant='link'
					href='/awaiting-cars'
					endIcon={<ChevronRightIcon />}
				>
					Смотреть все
				</Button>
			</Box>
			<Box display={'flex'} flexWrap={'wrap'} gap={1} mb={5}>
				<Carousel carouselContainerSx={{ ml: -1 }} showDots={false}>
					{carsOnParts.map((item) => (
						<Box key={item.id} width={{ xs: '100%', md: '50%', lg: '25%' }} sx={{ pl: 1 }}>
							<CarItem data={item}></CarItem>
						</Box>
					))}
				</Carousel>
			</Box>
		</>
	);
};
