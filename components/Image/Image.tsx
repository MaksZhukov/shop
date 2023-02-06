import getConfig from 'next/config';
import NextImage, { ImageProps } from 'next/image';
const { publicRuntimeConfig } = getConfig();

const Image = ({ src, isOnSSR = true, ...props }: ImageProps & { isOnSSR?: boolean }) => {
	const getSrc = () => {
		if (!src) {
			return props.width && props.width < 300 ? '/photo_thumbnail.jpg' : '/photo.jpg';
		}
		const hasHttps = src.toString().startsWith('https');
		if (isOnSSR) {
			return hasHttps ? src : publicRuntimeConfig.backendLocalUrl + src;
		}
		return src;
	};

	return (
		<NextImage
			{...props}
			src={getSrc()}
			style={{
				objectFit: 'contain',
				maxWidth: '100%',
				...props.style,
			}}
		></NextImage>
	);
};

export default Image;
