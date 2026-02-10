export const mainPageQueryKeys = {
	all: ['main-page'] as const,
	brands: () => [...mainPageQueryKeys.all, 'brands'] as const,
	newSpareParts: () => [...mainPageQueryKeys.all, 'newSpareParts'] as const,
	articles: () => [...mainPageQueryKeys.all, 'articles'] as const,
	carsOnParts: () => [...mainPageQueryKeys.all, 'carsOnParts'] as const,
	sparePartsTotal: () => [...mainPageQueryKeys.all, 'sparePartsTotal'] as const
};
