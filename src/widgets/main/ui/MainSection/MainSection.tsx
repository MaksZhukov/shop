import { Box } from '@mui/material';
import { SearchForm } from './SearchForm';
import { Banners } from 'shared/ui/Banners';

export const MainSection: React.FC = () => {
	return (
		<Box
			mb={5}
			minHeight={{ xs: 'auto', md: 446 }}
			display={'flex'}
			flexDirection={{ xs: 'column', md: 'row' }}
			gap={2}
		>
			<SearchForm />
			<Banners images={[]} />
		</Box>
	);
};
