import { Box, Container, SxProps } from '@mui/system';
import { Image as IImage } from 'api/types';
import Image from 'components/Image';
import { FC } from 'react';
import styles from './BlockImages.module.scss';

interface Props {
    images?: IImage[];
    imageSRCs?: string[];
    isOnSSR?: boolean;
    withoutOverlay?: boolean;
    sx?: SxProps<any>;
}

const BlockImages: FC<Props> = ({ images, imageSRCs = [], isOnSSR = false, withoutOverlay = false, sx }) => {
    return (
        <Box
            className={withoutOverlay ? '' : styles.overlay}
            paddingY="3em"
            marginY="3em"
            display="flex"
            gap={'1em'}
            sx={sx}>
            {images
                ? images.map((item) => (
                      <Box key={item.id}>
                          <Image src={item.url} alt={item.alternativeText} width={390} height={270}></Image>
                      </Box>
                  ))
                : imageSRCs.map((src) => (
                      <Box key={src}>
                          <Image isOnSSR={isOnSSR} src={src} alt="alt" width={390} height={270}></Image>
                      </Box>
                  ))}
        </Box>
    );
};

export default BlockImages;
