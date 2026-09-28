export type KindSparePartTypeDto = 'regular' | 'cabin';

export interface KindSparePartDto {
	id: number;
	name: string;
	slug: string;
	type: KindSparePartTypeDto;
}

export type KindSparePartWithSparePartsCountDto = KindSparePartDto & {
	spareParts: {
		count: number;
	};
};
