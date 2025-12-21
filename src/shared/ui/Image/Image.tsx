import { useMediaQuery, Box } from '@mui/material';
import NextImage, { ImageProps } from 'next/image';
import { useState } from 'react';
import { backendUrl } from 'shared/services/EnvService';
const MAX_LOADING_IMAGES_ERRORS = 1;

export const Image = ({
	src,
	alt = '',
	isOnSSR = true,
	style,
	...props
}: Omit<ImageProps, 'src' | 'alt'> & {
	src?: string | Blob;
	alt?: string;
	isOnSSR?: boolean;
	withZoom?: boolean;
	minWidth?: number;
}) => {
	const [key, setKey] = useState<number>(0);

	const handleError = () => {
		if (key < MAX_LOADING_IMAGES_ERRORS) {
			setKey(key + 1);
		}
	};
	if (!src || key === MAX_LOADING_IMAGES_ERRORS) {
		return (
			<Box
				maxWidth={props.width}
				minWidth={props.minWidth}
				bgcolor='primary.secondary'
				display='flex'
				margin='auto'
				alignItems='center'
				justifyContent='center'
			>
				<NextImage
					width={1200}
					alt={alt}
					height={props.height || 237}
					title={props.title}
					src={'/photo.png'}
					style={{ objectFit: 'contain', maxWidth: '50%' }}
				></NextImage>
			</Box>
		);
	}
	const getSrc = () => {
		const hasHttps = src.toString().startsWith('https');
		if (isOnSSR) {
			return hasHttps ? src : backendUrl + src;
		}
		return src;
	};

	return (
		<NextImage
			key={key}
			alt={alt}
			src={getSrc() as string}
			onError={handleError}
			style={{
				objectFit: 'contain',
				maxWidth: '100%',
				...style
			}}
			{...props}
		></NextImage>
	);
};
