import { Box } from '@mui/material';
import { Typography } from 'shared/ui';
import { POPULAR_CATEGORIES, POPULAR_CATEGORIES_CARD_LAYOUT } from '../../popularCategoriesConfig';
import { PopularCategoriesMobile } from './PopularCategoriesMobile';
import { PopularCategoriesDesktop } from './PopularCategoriesDesktop';

export const PopularCategories: React.FC = () => (
	<>
		<Box textAlign={{ xs: 'center', md: 'left' }} mb={1}>
			<Typography variant='h6'>Популярные категории</Typography>
			<Typography color='text.primary' variant='body2'>
				Все запчасти, представленные в каталоге, находятся на складе и готовы к оперативной отправке
			</Typography>
		</Box>

		<PopularCategoriesMobile categories={POPULAR_CATEGORIES} />
		<PopularCategoriesDesktop categories={POPULAR_CATEGORIES} cardLayout={POPULAR_CATEGORIES_CARD_LAYOUT} />
	</>
);
