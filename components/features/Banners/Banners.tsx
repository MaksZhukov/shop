import { Box } from '@mui/material';
import { Carousel } from 'components/ui/Carousel';

interface BannersProps {
	images: string[];
}

export const Banners: React.FC<BannersProps> = ({}) => {
	return (
		<Box flex={{ xs: 'none', md: '1' }} height={{ xs: 234, md: '446px' }} overflow={'hidden'} borderRadius={2}>
			<Carousel showArrows={true} showDots={true}>
				<Box bgcolor={'gray'} width={'50%'} height={'100%'}></Box>
				<Box bgcolor={'gray'} width={'50%'} height={'100%'}></Box>
				<Box bgcolor={'gray'} width={'50%'} height={'100%'}></Box>
			</Carousel>
		</Box>
	);
};
