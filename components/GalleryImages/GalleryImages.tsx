import { IconButton, Modal, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { FC, useState, MouseEventHandler } from 'react';
import Image from 'components/Image';
import Slider from 'react-slick';
import Zoom from 'next-image-zoom';
import styles from './GalleryImages.module.scss';
import { Image as IIamge } from 'api/types';

interface Props {
    images?: IIamge[];
    selectedIndex: null | number;
    onClose: () => void;
}

const GalleryImages: FC<Props> = ({ images, selectedIndex, onClose }) => {
    const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

    return (
        <Modal disableScrollLock open={selectedIndex !== null} onClose={onClose}>
            <Box padding='0 50px' sx={{ outline: 'none', transform: 'translateY(25%)', height: '75%' }}>
                <IconButton
                    size='large'
                    color='primary'
                    sx={{
                        position: 'absolute',
                        top: '-60px',
                        right: '20px',
                        opacity: 0.75
                    }}
                    onClick={onClose}
                    aria-label='close'>
                    <CloseIcon sx={{ color: '#fff' }} fontSize='large' />
                </IconButton>
                <Slider swipe={false} className={styles.slider} slidesToShow={1} initialSlide={selectedIndex as number}>
                    {images?.map((item) => (
                        <Box key={item.id} height={'100%'} sx={{ display: 'flex !important' }}>
                            <Image
                                title={item.caption}
                                withZoom
                                width={isTablet ? 500 : 820}
                                height={isTablet ? 375 : 600}
                                src={item.url}
                                alt={item.alternativeText}
                                style={{ maxHeight: '100%', margin: 'auto' }}></Image>
                        </Box>
                    ))}
                </Slider>
            </Box>
        </Modal>
    );
};

export default GalleryImages;
