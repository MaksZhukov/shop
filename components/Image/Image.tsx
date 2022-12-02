import getConfig from 'next/config';
import NextImage, { ImageProps } from 'next/image';
const { publicRuntimeConfig } = getConfig();

const Image = ({ src, isOnSSR = true, ...props }: ImageProps & { isOnSSR?: boolean }) => {
    return (
        <NextImage
            {...props}
            src={isOnSSR ? publicRuntimeConfig.backendLocalUrl + src : src}
            style={{
                ...props.style,
                objectFit: 'contain',
                maxWidth: '100%',
            }}
        ></NextImage>
    );
};

export default Image;
