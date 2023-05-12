// @ts-nocheck
import { Link, LinkProps } from '@mui/material';
import { Image as IImage } from 'api/types';
import Image from 'components/Image';
import Typography from 'components/Typography';
import NextLink from 'next/link';
import { CSSProperties, FC, HTMLAttributeAnchorTarget } from 'react';
import styles from './LinkWithImage.module.scss';

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
const LinkWithImage: FC<Props> = ({
    width = 208,
    height = 156,
    link,
    image,
    caption,
    withoutTitle = false,
    isOnSSR = true,
    imageStyle = { objectFit: 'contain', margin: 'auto' },
    targetLink = '_self',
    typographyProps = { variant: 'h6', marginTop: '1em' }
}) => {
    let title = caption || image?.caption;
    return (
        <NextLink className={styles.link} href={link} target={targetLink}>
            <Image
                title={image?.caption}
                style={imageStyle}
                alt={image?.alternativeText || ''}
                width={width}
                height={height}
                isOnSSR={isOnSSR}
                src={width > 200 ? image?.url : image?.formats?.thumbnail.url || ''}></Image>
            {!withoutTitle && title && (
                <Typography lineClamp='2' textAlign='center' {...typographyProps}>
                    {title}
                </Typography>
            )}
        </NextLink>
    );
};

export default LinkWithImage;
