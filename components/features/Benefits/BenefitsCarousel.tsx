import { Carousel } from 'components/ui/Carousel';
import { BenefitItem } from './types';
import { BenefitCard } from './BenefitCard';
import { Box } from '@mui/material';

interface BenefitsCarouselProps {
	benefitsData: BenefitItem[];
	sparePartsTotal: number;
}

export const BenefitsCarousel: React.FC<BenefitsCarouselProps> = ({ benefitsData, sparePartsTotal }) => {
	return (
		<Carousel carouselContainerSx={{ ml: -1 }} showArrows={false} showDots={false}>
			{benefitsData.map((item) => (
				<Box pl={1} width={'45%'}>
					<BenefitCard key={item.id} item={item} sparePartsTotal={sparePartsTotal} />
				</Box>
			))}
		</Carousel>
	);
};
