import { useMemo } from 'react';
import { BenefitsProps } from './types';
import { getBenefitsData } from './config';
import { BenefitsGrid } from './BenefitsGrid';
import { BenefitsCarousel } from './BenefitsCarousel';

export const Benefits: React.FC<BenefitsProps> = ({ sparePartsTotal, view = 'grid' }) => {
	const benefitsData = useMemo(() => getBenefitsData(), []);

	if (view === 'carousel') {
		return <BenefitsCarousel benefitsData={benefitsData} sparePartsTotal={sparePartsTotal} />;
	}

	return <BenefitsGrid benefitsData={benefitsData} sparePartsTotal={sparePartsTotal} />;
};
