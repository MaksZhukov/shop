import { Box } from '@mui/material';
import { SearchForm } from './SearchForm';
import { Brand } from 'api/brands/types';
import { Banners } from 'components/features/Banners';

interface MainSectionProps {
	brands: Brand[];
	sparePartsTotal: number;
}

export const MainSection: React.FC<MainSectionProps> = ({ brands, sparePartsTotal }) => {
	return (
		<Box
			mb={5}
			minHeight={{ xs: 'auto', md: 446 }}
			display={'flex'}
			flexDirection={{ xs: 'column', md: 'row' }}
			gap={2}
		>
			<SearchForm brands={brands} sparePartsTotal={sparePartsTotal} />
			<Banners images={[]} />
		</Box>
	);
};
