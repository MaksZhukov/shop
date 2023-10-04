import { Image, ImageFormat } from 'api/types';

const orderFormats: ImageFormat[] = ['thumbnail', 'small', 'medium', 'large'];

export const getUrlByMinFormat = (image?: Image, minFormat: ImageFormat = 'large') => {
	const order = orderFormats.slice(
		orderFormats.findIndex((item) => item === minFormat),
		orderFormats.length
	);

	if (image?.formats) {
		let format = order.find((item) => image.formats && image.formats[item]);
		return format ? image.formats[format].url : image.url;
	}
	return image ? image.url : '';
};
