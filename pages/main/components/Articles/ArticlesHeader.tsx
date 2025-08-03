import { Box, Typography } from '@mui/material';
import { ViewAllButton } from './ViewAllButton';

export const ArticlesHeader: React.FC = () => (
	<Box display='flex' justifyContent='space-between' alignItems='start' mb={{ xs: 2, md: 1 }}>
		<Box flex={1} textAlign={{ xs: 'center', md: 'left' }}>
			<Typography variant='h6'>Новости авторазборки</Typography>
			<Typography color='text.primary' variant='body1'>
				Все самое актуальное от нашей компании
			</Typography>
		</Box>
		<ViewAllButton title='Смотреть все' visibility='desktop' />
	</Box>
);
