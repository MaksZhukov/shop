import { Box, Container, SxProps } from '@mui/system';
import Image from 'components/Image';
import { FC } from 'react';
import styles from './BlockImages.module.scss';

interface Props {
    imageSRCs?: string[];
    isOnSSR?: boolean;
    sx?: SxProps<any>;
}

const BlockImages: FC<Props> = ({ imageSRCs = [], isOnSSR = false, sx }) => {
    return (
        <Box className={styles.block} paddingY="3em" marginY="3em" display="flex" gap={'1em'} sx={sx}>
            {imageSRCs.map((src) => (
                <Box key={src}>
                    <Image isOnSSR={isOnSSR} src={src} alt="alt" width={390} height={270}></Image>
                </Box>
            ))}
        </Box>
    );
};

export default BlockImages;
