import { Box } from '@mui/system';
import getConfig from 'next/config';
import NextImage, { ImageProps } from 'next/image';
const { publicRuntimeConfig } = getConfig();

const Image = ({
    src,
    alt = '',
    isOnSSR = true,
    style,
    ...props
}: Omit<ImageProps, 'src' | 'alt'> & { src?: string; alt?: string; isOnSSR?: boolean }) => {
    if (!src) {
        return (
            <Box
                maxWidth={props.width}
                bgcolor='primary.main'
                display='flex'
                alignItems='center'
                justifyContent='center'>
                <NextImage
                    width={1200}
                    alt={alt}
                    height={237}
                    title={props.title}
                    src={'/photo.jpg'}
                    style={{ objectFit: 'contain', maxWidth: '50%' }}></NextImage>
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
            alt={alt}
            src={getSrc()}
            style={{
                objectFit: 'contain',
                maxWidth: '100%',
                ...style
            }}
            {...props}></NextImage>
    );
};

export default Image;
