import { formatNumberWithSeparators } from 'shared/utils/numberUtils';
import type { BenefitItem } from './benefitsTypes';

export const getBenefitsData = (): BenefitItem[] => [
	{
		id: 'spare-parts',
		title: 'Автозапчасти',
		subtitle: 'Без пробега по РБ',
		image: '/main_spare_parts.png'
	},
	{
		id: 'delivery',
		title: 'Доставка',
		subtitle: 'Во все регионы РБ',
		image: '/main_delivery.png'
	},
	{
		id: 'warranty',
		title: 'Гарантия',
		subtitle: 'На весь ассортимент',
		image: '/main_guarantee.png'
	},
	{
		id: 'in-stock',
		title: 'запчастей',
		subtitle: 'В наличии на складе',
		formatter: (value: number) => `${formatNumberWithSeparators(value)} запчастей`,
		image: '/main_count_spare_parts.png'
	}
];
