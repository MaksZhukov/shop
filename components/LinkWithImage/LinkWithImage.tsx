import { Link, Typography } from '@mui/material';
import { Image as IImage } from 'api/types';
import getConfig from 'next/config';
import Image from 'next/image';
import NextLink from 'next/link';
import { FC, HTMLAttributeAnchorTarget } from 'react';

const { publicRuntimeConfig } = getConfig();

interface Props {
	link: string;
	targetLink?: HTMLAttributeAnchorTarget;
	width?: number;
	height?: number;
	image: IImage;
}
const LinkWithImage: FC<Props> = ({
	width = 208,
	height = 156,
	link,
	image,
	targetLink = '_self',
}) => {
	return (
		<NextLink href={link} target={targetLink}>
			<Image
				alt={image.alternativeText}
				width={width}
				height={height}
				src={
					publicRuntimeConfig.backendLocalUrl +
					image.formats?.thumbnail.url
				}></Image>
			{image.caption && (
				<Link component='div' textAlign='center' marginTop='1em'>
					{image.caption}
				</Link>
			)}
		</NextLink>
	);
};

export default LinkWithImage;
