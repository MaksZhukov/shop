import { Box, useTheme } from '@mui/material';
import { BenefitItem } from './types';
import { BenefitCard } from './BenefitCard';

interface BenefitsGridProps {
	benefitsData: BenefitItem[];
	sparePartsTotal: number;
}

export const BenefitsGrid: React.FC<BenefitsGridProps> = ({ benefitsData, sparePartsTotal }) => {
	const theme = useTheme();

	return (
		<Box mb={5} display='flex' gap={1} flexWrap='wrap'>
			{benefitsData.map((item) => (
				<BenefitCard
					key={item.id}
					item={item}
					sparePartsTotal={sparePartsTotal}
					sx={{ flex: { xs: `calc(50% - ${theme.spacing(1)})`, md: '1' } }}
				/>
			))}
		</Box>
	);
};
