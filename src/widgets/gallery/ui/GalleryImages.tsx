import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Modal, useMediaQuery } from '@mui/material';
import { Box } from '@mui/material';
import { Image as IIamge } from 'shared/api/types';
import { Zoom } from './Zoom';
import { FC } from 'react';
import { Carousel } from 'shared/ui';
import { backendUrl } from 'shared/services/EnvService';

interface Props {
	images?: IIamge[];
	selectedIndex: null | number;
	onClose: () => void;
}

export const GalleryImages: FC<Props> = ({ images, selectedIndex, onClose }) => {
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
					aria-label='close'
				>
					<CloseIcon sx={{ color: 'secondary.main' }} fontSize='large' />
				</IconButton>
				<Carousel showDots={false} sx={{ maxWidth: 1500, margin: 'auto' }}>
					{images?.map((item) => (
						<Box width={'100%'} key={item.id} height={'100%'} sx={{ display: 'flex !important' }}>
							<Zoom
								src={backendUrl + (item.formats?.medium?.url || item.url)}
								width={isTablet ? 500 : 820}
								height={'100%'}
								style={{ margin: 'auto' }}
								zoomScale={3}
							/>
						</Box>
					))}
				</Carousel>
			</Box>
		</Modal>
	);
};
