import { Box } from '@mui/material';
import { BrandItem, type Brand } from 'entities/brand';
import { Typography } from 'shared/ui';
import { mainPageQueryKeys, mainPageQueryFns } from 'features/mainPage';
import { useDI } from '../../mainPage.di';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from 'shared/api/types';

export const BrandSelection: React.FC = () => {
	const { brandService } = useDI();
	const { data: brandsRes } = useQuery({
		queryKey: mainPageQueryKeys.brands(),
		queryFn: () => mainPageQueryFns.brands(brandService),
		select: (res: ApiResponse<Brand[]>) => res.data || []
	});
	const brands = brandsRes ?? [];
	return (
		<Box
			sx={{
				mb: 5
			}}
		>
			<Typography variant='h6' sx={{ textAlign: { xs: 'center', md: 'left' } }}>
				Выберите марку авто
			</Typography>
			<Typography color='text.primary' variant='body2' sx={{ textAlign: { xs: 'center', md: 'left' } }}>
				Автозапчасти б/у на авторазборке в наличии
			</Typography>
			<Box
				sx={{
					mt: 1,
					display: 'flex',
					justifyContent: { xs: 'center', md: 'flex-start' },
					flexWrap: 'wrap',
					gap: 1
				}}
			>
				{brands.map((brand) => (
					<BrandItem key={brand.id} brand={brand} />
				))}
			</Box>
		</Box>
	);
};
