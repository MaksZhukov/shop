export interface TopCategoryKindSparePartDto {
	id: number;
	name: string;
	slug: string;
	code: number;
	type: 'regular' | 'cabin';
	spareParts: {
		count: number;
	};
}

export interface TopCategoryDto {
	name: string;
	kindSpareParts: TopCategoryKindSparePartDto[];
	totalSparePartsCount: number;
}
