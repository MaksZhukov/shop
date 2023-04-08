import { Box } from '@mui/system';
import getConfig from 'next/config';
import NextImage, { ImageProps } from 'next/image';
import Zoom from 'react-img-hover-zoom';
import { useMediaQuery } from '@mui/material';
const { publicRuntimeConfig } = getConfig();

const Image = ({
    src,
    alt = '',
    isOnSSR = true,
    withZoom = false,
    style,
    ...props
}: Omit<ImageProps, 'src' | 'alt'> & { src?: string; alt?: string; isOnSSR?: boolean; withZoom?: boolean }) => {
    const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
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
                    height={props.height || 237}
                    title={props.title}
                    src={'/photo.png'}
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

    if (withZoom && !isTablet) {
        return (
            <Zoom
                img={publicRuntimeConfig.backendUrl + src}
                width={props.width || 640}
                height={props.height || 480}
                style={{ margin: 'auto' }}
                zoomScale={3}
            />
        );
    }

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
