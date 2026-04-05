export type KindSparePartType = 'regular' | 'cabin';

export interface KindSparePart {
	id: number;
	name: string;
	slug: string;
	type: KindSparePartType;
}

export type KindSparePartWithSparePartsCount = KindSparePart & {
	spareParts: {
		count: number;
	};
};




