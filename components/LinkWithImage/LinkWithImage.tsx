// @ts-nocheck
import { Link, LinkProps } from '@mui/material';
import { Image as IImage } from 'api/types';
import Image from 'components/Image';
import NextLink from 'next/link';
import { CSSProperties, FC, HTMLAttributeAnchorTarget } from 'react';
import styles from './LinkWithImage.module.scss';

interface Props {
    link: string;
    targetLink?: HTMLAttributeAnchorTarget;
    width?: number;
    height?: number;
    image?: IImage;
    imageStyle?: CSSProperties;
    caption?: string;
    linkProps?: LinkProps;
}
const LinkWithImage: FC<Props> = ({
    width = 208,
    height = 156,
    link,
    image,
    caption,
    imageStyle = { objectFit: 'contain', margin: 'auto' },
    targetLink = '_self',
    linkProps = { variant: 'h6', marginTop: '1em' }
}) => {
    let title = caption || image?.caption;
    return (
        <NextLink className={styles.link} href={link} target={targetLink}>
            <Image
                style={imageStyle}
                alt={image?.alternativeText || ''}
                width={width}
                height={height}
                isOnSSR={!!image}
                src={width > 200 ? image?.url : image?.formats?.thumbnail.url || ''}></Image>
            {title && (
                <Link {...linkProps} color="inherit" underline={'hover'} component="div" textAlign="center">
                    {title}
                </Link>
            )}
        </NextLink>
    );
};

export default LinkWithImage;
