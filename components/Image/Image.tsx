import getConfig from 'next/config';
import NextImage, { ImageProps } from 'next/image';
const { publicRuntimeConfig } = getConfig();

const Image = ({ src, isOnSSR = true, ...props }: ImageProps & { isOnSSR?: boolean }) => {
	const getSrc = () => {
		if (!src) {
			return props.width && props.width < 300 ? '/photo_thumbnail.png' : '/photo.png';
		}
		if (isOnSSR) {
			return publicRuntimeConfig.backendLocalUrl + src;
		}
		return src;
	};
	return (
		<NextImage
			{...props}
			src={getSrc()}
			style={{
				...props.style,
				objectFit: 'contain',
				height: 'auto',
				maxWidth: '100%',
			}}
		></NextImage>
	);
};

export default Image;
