export interface TopCategoryKindSparePart {
	id: number;
	name: string;
	slug: string;
	code: number;
	type: 'regular' | 'cabin';
	spareParts: {
		count: number;
	};
}

export interface TopCategory {
	name: string;
	kindSpareParts: TopCategoryKindSparePart[];
	totalSparePartsCount: number;
}




