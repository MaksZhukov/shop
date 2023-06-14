import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Modal, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { Image as IIamge } from 'api/types';
import Zoom from 'components/Zoom';
import getConfig from 'next/config';
import { FC } from 'react';
import Slider from 'react-slick';
import styles from './GalleryImages.module.scss';
const { publicRuntimeConfig } = getConfig();

interface Props {
	images?: IIamge[];
	selectedIndex: null | number;
	onClose: () => void;
}

const GalleryImages: FC<Props> = ({ images, selectedIndex, onClose }) => {
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

	return (
		<Modal disableScrollLock open={selectedIndex !== null} onClose={onClose}>
			<Box padding='0 50px' sx={{ outline: 'none', transform: 'translateY(20%)', height: '75%' }}>
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
							<Zoom
								src={publicRuntimeConfig.backendUrl + (item.formats?.medium?.url || item.url)}
								width={isTablet ? 500 : 820}
								height={'100%'}
								style={{ margin: 'auto' }}
								zoomScale={3}
							/>
						</Box>
					))}
				</Slider>
			</Box>
		</Modal>
	);
};

export default GalleryImages;
