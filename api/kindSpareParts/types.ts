export interface KindSparePart {
	id: number;
	name: string;
	slug: string;
	type: 'regular' | 'cabin';
}

export type KindSparePartWithSparePartsCount = KindSparePart & {
	spareParts: {
		count: number;
	};
};
