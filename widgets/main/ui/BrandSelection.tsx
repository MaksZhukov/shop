import { Box } from '@mui/material';
import type { Brand } from 'entities/brand/brandTypes';
import { Typography } from 'shared/ui';
import { BrandItem } from 'entities/brand';

interface BrandSelectionProps {
	brands: Brand[];
}

export const BrandSelection: React.FC<BrandSelectionProps> = ({ brands }) => {
	return (
		<Box mb={5}>
			<Typography textAlign={{ xs: 'center', md: 'left' }} variant='h6'>
				Выберите марку авто
			</Typography>
			<Typography textAlign={{ xs: 'center', md: 'left' }} color='text.primary' variant='body2'>
				Автозапчасти б/у на авторазборке в наличии
			</Typography>
			<Box mt={1} display={'flex'} justifyContent={{ xs: 'center', md: 'flex-start' }} flexWrap={'wrap'} gap={1}>
				{brands.map((brand) => (
					<BrandItem key={brand.id} brand={brand} />
				))}
			</Box>
		</Box>
	);
};
