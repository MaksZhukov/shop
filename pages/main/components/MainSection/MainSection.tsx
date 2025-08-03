import { Box } from '@mui/material';
import { SearchForm } from './SearchForm';
import { Carousel } from 'components/ui/Carousel';
import { Brand } from 'api/brands/types';

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
			<Box flex={{ xs: 'none', md: '1' }} height={{ xs: 234, md: '446px' }} overflow={'hidden'} borderRadius={2}>
				<Carousel showArrows={true} showDots={true}>
					<Box bgcolor={'gray'} width={'50%'} height={'100%'}></Box>
					<Box bgcolor={'gray'} width={'50%'} height={'100%'}></Box>
					<Box bgcolor={'gray'} width={'50%'} height={'100%'}></Box>
				</Carousel>
			</Box>
		</Box>
	);
};
