import { useMemo } from 'react';
import type { BenefitsProps } from '../benefitsTypes';
import { getBenefitsData } from '../benefitsConfig';
import { BenefitsGrid } from './benefitsGrid.component';
import { BenefitsCarousel } from './benefitsCarousel.component';
import { type SparePart } from 'entities/sparePart';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from 'shared/api';
import { useDI } from '../benefits.di';

export const Benefits: React.FC<BenefitsProps> = ({ view = 'grid' }) => {
	const { sparePartService } = useDI();
	const benefitsData = useMemo(() => getBenefitsData(), []);
	const { data: sparePartsTotalRes } = useQuery({
		queryKey: ['benefits', 'sparePartsTotal'],
		queryFn: () =>
			sparePartService
				.fetchSpareParts({
					pagination: { limit: 0 },
					filters: { sold: false }
				})
				.then((response) => response.data),
		select: (res: ApiResponse<SparePart[]>) => res.meta?.pagination?.total ?? 0
	});
	const sparePartsTotal = sparePartsTotalRes ?? 0;

	if (view === 'carousel') {
		return <BenefitsCarousel benefitsData={benefitsData} sparePartsTotal={sparePartsTotal} />;
	}

	return <BenefitsGrid benefitsData={benefitsData} sparePartsTotal={sparePartsTotal} />;
};
