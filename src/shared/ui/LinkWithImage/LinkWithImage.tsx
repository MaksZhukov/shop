import { LinkProps } from '@mui/material';
import type { Image as IImage } from 'shared/api/types';
import { Image } from 'shared/ui';
import { Typography } from 'shared/ui';
import { CSSProperties, FC, HTMLAttributeAnchorTarget } from 'react';
import { Link } from 'shared/ui';

interface Props {
	link: string;
	targetLink?: HTMLAttributeAnchorTarget;
	width?: number;
	height?: number;
	withoutTitle?: boolean;
	image?: IImage;
	imageStyle?: CSSProperties;
	caption?: string;
	isOnSSR?: boolean;
	typographyProps?: LinkProps;
}
export const LinkWithImage: FC<Props> = ({
	width = 208,
	height = 156,
	link,
	image,
	caption,
	withoutTitle = false,
	isOnSSR = true,
	imageStyle = { objectFit: 'contain', margin: 'auto' },
	targetLink = '_self'
}) => {
	let title = caption || image?.caption;

	return (
		<Link href={link} target={targetLink}>
			<Image
				title={image?.caption}
				style={imageStyle}
				alt={image?.alternativeText || ''}
				width={width}
				height={height}
				isOnSSR={isOnSSR}
				src={width > 200 ? image?.url : image?.formats?.thumbnail.url || ''}
			></Image>
			{!withoutTitle && title && (
				<Typography variant='body2' color='text.primary' lineClamp={2} textAlign='center'>
					{title}
				</Typography>
			)}
		</Link>
	);
};
