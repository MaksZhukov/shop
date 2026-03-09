import type { PopularCategoryItem } from './popularCategoriesTypes';

export const POPULAR_CATEGORIES: PopularCategoryItem[] = [
	{ title: 'Автозапчасти', subtitle: 'Без пробега по РБ', image: '/main_cat_spare_parts.png' },
	{ title: 'Детали кузова', subtitle: 'Оригинальные запчасти', image: '/main_cat_body_parts.png' },
	{ title: 'Двигатели', subtitle: 'Из Европы и США', image: '/main_cat_engine.png' },
	{ title: 'Трансмиссия', subtitle: 'Коробка АКПП и МКПП', image: '/main_cat_transmission.png' },
	{ title: 'Оптика', subtitle: 'Оригинальные запчасти', image: '/main_cat_optics.png' },
	{ title: 'Шины и диски', subtitle: 'Гарантия качества', image: '/main_cat_tires.png' }
];

/** Column indices for desktop 4-column layout; single-item columns render as tall cards */
export const POPULAR_CATEGORIES_CARD_LAYOUT: number[][] = [
	[0, 1],
	[2],
	[3, 4],
	[5]
];
