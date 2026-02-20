import type { Product } from './productTypes';
import { isCabin, isSparePart, isTire, isWheel } from './productGuards';

export interface ProductDescriptionItem {
	title: string;
	value: string | number | undefined;
	link?: string;
}

export const getProductDescriptionItems = (product: Product): ProductDescriptionItem[] => {
	if (isSparePart(product)) {
		return [
			{ title: 'Марка', value: product.brand?.name, link: '/spare-parts/' + product.brand?.slug },
			{
				title: 'Модель',
				value: product.model?.name,
				link: '/spare-parts/' + product.brand?.slug + '/model-' + product.model?.slug
			},
			{ title: 'Год', value: product.year },
			{ title: 'Ориг.номер', value: product.id },
			{ title: 'Обьем двигателя', value: product.volume?.name },
			{ title: 'Тип топлива', value: product.fuel },
			{ title: 'Примечание', value: product.description },
			{ title: 'Маркировка двигателя', value: product.engine },
			{ title: 'КПП', value: product.transmission },
			{ title: 'Привод', value: product.id },
			{ title: 'Тип кузова', value: product.id }
		];
	}

	if (isTire(product)) {
		return [
			{ title: 'Марка', value: product.brand?.name, link: '/tires/' + product.brand?.slug },
			{ title: 'Ширина', value: product.width?.name },
			{ title: 'Высота профиля', value: product.height?.name },
			{ title: 'Диаметр', value: product.diameter?.name },
			{ title: 'Сезон', value: product.season },
			{ title: 'Бренд', value: product.brand?.name },
			{ title: 'Описание', value: product.description }
		];
	}

	if (isWheel(product)) {
		return [
			{ title: 'Марка', value: product.brand?.name, link: '/wheels/' + product.brand?.slug },
			{
				title: 'Модель',
				value: product.model?.name,
				link: '/wheels/' + product.brand?.slug + '/model-' + product.model?.slug
			},
			{ title: 'Диаметр', value: product.diameter?.name },
			{ title: 'Ширина', value: product.width?.name },
			{ title: 'Количество отверстий', value: product.numberHoles?.name },
			{ title: 'Тип', value: product.kind },
			{ title: 'Вылет диска', value: product.diskOffset?.name },
			{ title: 'Диаметр центрального отверстия', value: product.diameterCenterHole?.name },
			{ title: 'Межболтовое расстояние', value: product.distanceBetweenCenters },
			{ title: 'Описание', value: product.description }
		];
	}

	if (isCabin(product)) {
		return [
			{ title: 'Марка', value: product.brand?.name, link: '/cabins/' + product.brand?.slug },
			{
				title: 'Модель',
				value: product.model?.name,
				link: '/cabins/' + product.brand?.slug + '/model-' + product.model?.slug
			},
			{ title: 'Год', value: product.year },
			{ title: 'Поколение', value: product.generation?.name },
			{ title: 'Тип', value: product.kindSparePart?.name },
			{ title: 'Обивка сидений', value: product.seatUpholstery },
			{ title: 'Описание', value: product.description }
		];
	}

	return [];
};
