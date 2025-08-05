import { formatNumberWithSeparators } from 'services/NumberService';
import { BenefitItem } from './types';

export const getBenefitsData = (): BenefitItem[] => [
	{
		id: 'spare-parts',
		title: 'Автозапчасти',
		subtitle: 'Без пробега по РБ'
	},
	{
		id: 'delivery',
		title: 'Доставка',
		subtitle: 'Во все регионы РБ'
	},
	{
		id: 'warranty',
		title: 'Гарантия',
		subtitle: 'На весь ассортимент'
	},
	{
		id: 'in-stock',
		title: 'запчастей',
		subtitle: 'В наличии на складе',
		formatter: (value: number) => `${formatNumberWithSeparators(value)} запчастей`
	}
];
