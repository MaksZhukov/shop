import { SxProps } from '@mui/material';

export interface BenefitsProps {
	sparePartsTotal: number;
	view: 'grid' | 'carousel';
}

export interface BenefitItem {
	id: string;
	title: string;
	subtitle: string;
	formatter?: (value: number) => string;
}

export interface BenefitCardProps {
	item: BenefitItem;
	sparePartsTotal?: number;
	sx?: SxProps;
}
