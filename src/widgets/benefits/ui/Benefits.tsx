import { useMemo } from 'react';
import type { BenefitsProps } from '../benefitsTypes';
import { getBenefitsData } from '../benefitsConfig';
import { BenefitsGrid } from './BenefitsGrid';
import { BenefitsCarousel } from './BenefitsCarousel';
import { SparePart } from 'entities/sparePart';
import { mainPageQueryFns, mainPageQueryKeys } from 'features/mainPage';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from 'shared/api';

export const Benefits: React.FC<BenefitsProps> = ({ view = 'grid' }) => {
	const benefitsData = useMemo(() => getBenefitsData(), []);
	const { data: sparePartsTotalRes } = useQuery({
		queryKey: mainPageQueryKeys.sparePartsTotal(),
		queryFn: mainPageQueryFns.sparePartsTotal,
		select: (res: ApiResponse<SparePart[]>) => res.meta?.pagination?.total ?? 0
	});
	const sparePartsTotal = sparePartsTotalRes ?? 0;

	if (view === 'carousel') {
		return <BenefitsCarousel benefitsData={benefitsData} sparePartsTotal={sparePartsTotal} />;
	}

	return <BenefitsGrid benefitsData={benefitsData} sparePartsTotal={sparePartsTotal} />;
};
