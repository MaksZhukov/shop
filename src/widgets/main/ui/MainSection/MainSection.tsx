import { Box } from '@mui/material';
import { SearchForm } from './SearchForm';
import type { Brand } from 'entities/brand/brandTypes';
import { Banners } from 'shared/ui/Banners';

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
