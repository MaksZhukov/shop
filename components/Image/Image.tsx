import NextImage, { ImageProps } from 'next/image';

const Image = (props: ImageProps) => {
	return (
		<NextImage
			{...props}
			style={{ ...props.style, objectFit: 'contain' }}></NextImage>
	);
};

export default Image;
