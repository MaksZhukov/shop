import { useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import getConfig from 'next/config';
import NextImage, { ImageProps } from 'next/image';
import { useState } from 'react';
const { publicRuntimeConfig } = getConfig();

const Image = ({
	src,
	alt = '',
	isOnSSR = true,
	style,
	...props
}: Omit<ImageProps, 'src' | 'alt'> & { src?: string; alt?: string; isOnSSR?: boolean; withZoom?: boolean }) => {
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const [key, setKey] = useState<number>(0);

	const handleError = () => {
		if (key < 3) {
			setKey(key + 1);
		}
	};
	if (!src) {
		return (
			<Box
				maxWidth={props.width}
				bgcolor='primary.main'
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
			return hasHttps ? src : publicRuntimeConfig.backendLocalUrl + src;
		}
		return src;
	};

	return (
		<NextImage
			key={key}
			alt={alt}
			src={getSrc()}
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

export default Image;
