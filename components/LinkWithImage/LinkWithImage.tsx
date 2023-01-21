import { Link, LinkProps } from '@mui/material';
import { Image as IImage } from 'api/types';
import Image from 'components/Image';
import NextLink from 'next/link';
import { FC, HTMLAttributeAnchorTarget } from 'react';
import styles from './LinkWithImage.module.scss';

interface Props {
	link: string;
	targetLink?: HTMLAttributeAnchorTarget;
	width?: number;
	height?: number;
	image?: IImage;
	caption?: string;
	linkProps: LinkProps;
}
const LinkWithImage: FC<Props> = ({
	width = 208,
	height = 156,
	link,
	image,
	caption,
	targetLink = '_self',
	linkProps = { variant: 'h6', marginTop: '1em' },
}) => {
	let title = caption || image?.caption;
	return (
		<NextLink className={styles.link} href={link} target={targetLink}>
			<Image
				style={{ objectFit: 'contain', margin: 'auto' }}
				alt={image?.alternativeText || ''}
				width={width}
				height={height}
				isOnSSR={!!image}
				src={image?.formats?.thumbnail.url || image?.url || ''}
			></Image>
			{
				// @ts-nocheck
			}
			{title && (
				<Link {...linkProps} color='inherit' underline={'hover'} component='div' textAlign='center'>
					{title}
				</Link>
			)}
		</NextLink>
	);
};

export default LinkWithImage;
