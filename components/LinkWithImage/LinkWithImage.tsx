import { Typography } from '@mui/material';
import { Image as IImage } from 'api/types';
import getConfig from 'next/config';
import Image from 'next/image';
import Link from 'next/link';
import { FC, HTMLAttributeAnchorTarget } from 'react';

const { publicRuntimeConfig } = getConfig();

interface Props {
	link: string;
	targetLink?: HTMLAttributeAnchorTarget;
	image: IImage;
}
const LinkWithImage: FC<Props> = ({ link, image, targetLink = '_self' }) => {
	return (
		<Link href={link} target={targetLink}>
			<Image
				alt={image.alternativeText}
				width={208}
				height={156}
				src={
					publicRuntimeConfig.backendLocalUrl +
					image.formats?.thumbnail.url
				}></Image>
			{image.caption && <Typography>{image.caption}</Typography>}
		</Link>
	);
};

export default LinkWithImage;
