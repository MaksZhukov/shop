import { Box } from '@mui/material';
import { SparePart } from 'api/spareParts/types';
import { Button } from 'components/ui';
import { ChevronRightIcon } from 'components/icons';
import { Typography, Carousel } from 'components/ui';
import ProductItem from 'components/features/ProductItem';

interface NewArrivalsProps {
	newSpareParts: SparePart[];
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ newSpareParts }) => {
	return (
		<>
			<Box display={'flex'} justifyContent={'space-between'} alignItems={'start'} mb={1}>
				<Box flex={1} textAlign={{ xs: 'center', md: 'left' }}>
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
			<Box mb={5}>
				<Carousel carouselContainerSx={{ ml: -1 }} showDots={false}>
					{newSpareParts.map((item) => (
						<Box key={item.id} width={{ xs: '100%', md: '50%', lg: '25%' }} sx={{ pl: 1 }}>
							<ProductItem data={item} width={342}></ProductItem>
						</Box>
					))}
				</Carousel>
			</Box>
		</>
	);
};
