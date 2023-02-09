import getConfig from 'next/config';
import NextImage, { ImageProps } from 'next/image';
const { publicRuntimeConfig } = getConfig();

const Image = ({
    src,
    alt = '',
    isOnSSR = true,
    ...props
}: Omit<ImageProps, 'src' | 'alt'> & { src?: string; alt?: string; isOnSSR?: boolean }) => {
    const getSrc = () => {
        if (!src) {
            return props.width && props.width < 300 ? '/photo_thumbnail.jpg' : '/photo.jpg';
        }
        const hasHttps = src.toString().startsWith('https');
        if (isOnSSR) {
            return hasHttps ? src : publicRuntimeConfig.backendLocalUrl + src;
        }
        return src;
    };

    return (
        <NextImage
            alt={alt}
            src={getSrc()}
            style={{
                objectFit: 'contain',
                maxWidth: '100%',
                ...props.style
            }}
            {...props}></NextImage>
    );
};

export default Image;
