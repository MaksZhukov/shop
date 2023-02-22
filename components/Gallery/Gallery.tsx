import { IconButton, Modal, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import WhiteBox from 'components/WhiteBox';
import { FC, useState } from 'react';
import Image from 'components/Image';
import Typography from 'components/Typography';
import Slider from 'react-slick';
import styles from './Gallery.module.scss';
import { DefaultPage } from 'api/pages/types';
import { Image as IIamge } from 'api/types';

interface Props {
    page: DefaultPage & { images: IIamge[] };
}

const Gallery: FC<Props> = ({ page }) => {
    const [index, setIndex] = useState<number | null>(null);
    const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
    const handleClickImage = (i: number) => () => {
        setIndex(i);
    };
    const handleClose = () => {
        setIndex(null);
    };
    return (
        <>
            <Typography component="h1" textTransform="uppercase" variant="h4" textAlign="center" marginBottom="1em">
                {page.seo?.h1}
            </Typography>
            <Box display="flex" justifyContent="space-around" flexWrap="wrap">
                {page.images?.map((item, i) => (
                    <Box
                        width={{ xs: 150, md: 300 }}
                        height={{ xs: 115, md: 225 }}
                        onClick={handleClickImage(i)}
                        sx={{ cursor: 'pointer' }}
                        marginBottom="1em"
                        key={item.id}>
                        <Image
                            title={item.caption}
                            width={300}
                            height={225}
                            src={item.formats?.small?.url || item.url}
                            style={{ maxHeight: '100%' }}
                            alt={item.alternativeText}></Image>
                    </Box>
                ))}
            </Box>

            <Modal open={index !== null} onClose={handleClose}>
                <Box padding="0 50px" sx={{ outline: 'none', transform: 'translateY(50%)' }}>
                    <IconButton
                        size="large"
                        color="primary"
                        sx={{
                            position: 'absolute',
                            top: '-25%',
                            right: '20px',
                            opacity: 0.75
                        }}
                        onClick={handleClose}
                        aria-label="close">
                        <CloseIcon sx={{ color: '#fff' }} fontSize="large" />
                    </IconButton>
                    <Slider className={styles.slider} slidesToShow={1} initialSlide={index as number}>
                        {page.images?.map((item) => (
                            <Image
                                title={item.caption}
                                key={item.id}
                                width={isTablet ? 500 : 640}
                                height={isTablet ? 375 : 480}
                                src={item.formats?.small?.url || item.url}
                                alt={item.alternativeText}></Image>
                        ))}
                    </Slider>
                </Box>
            </Modal>
        </>
    );
};

export default Gallery;
