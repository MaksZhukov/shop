import { Link, Typography } from '@mui/material';
import { Image as IImage } from 'api/types';
import Image from 'components/Image';
import getConfig from 'next/config';
import NextLink from 'next/link';
import { FC, HTMLAttributeAnchorTarget } from 'react';

const { publicRuntimeConfig } = getConfig();

interface Props {
	link: string;
	targetLink?: HTMLAttributeAnchorTarget;
	width?: number;
	height?: number;
	image?: IImage;
}
const LinkWithImage: FC<Props> = ({ width = 208, height = 156, link, image, targetLink = '_self' }) => {
	return (
		<NextLink href={link} target={targetLink}>
			<Image
				style={{ objectFit: 'contain' }}
				alt={image?.alternativeText || ''}
				width={width}
				height={height}
				isOnSSR={!!image}
				src={image?.formats?.thumbnail.url || image?.url || ''}
			></Image>
			{image?.caption && (
				<Link component='div' textAlign='center' marginTop='1em'>
					{image.caption}
				</Link>
			)}
		</NextLink>
	);
};

export default LinkWithImage;
