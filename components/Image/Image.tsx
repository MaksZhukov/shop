import NextImage, { ImageProps } from 'next/image';

const Image = (props: ImageProps) => {
	return (
		<NextImage
			{...props}
			style={{
				...props.style,
				objectFit: 'contain',
				maxWidth: '100%',
			}}></NextImage>
	);
};

export default Image;
