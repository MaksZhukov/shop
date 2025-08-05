import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';
import { Link, ModalContainer } from 'components/ui';
import { WorkTimetable } from 'components/features/WorkTimetable';
import { SocialButtons } from 'components/features/SocialsButtons';
import Image from 'components/features/Image';
import { SOCIAL_BUTTONS_MOBILE } from '../constants';
import { COMPANY_COORDINATES, COMPANY_ADDRESS } from '../../../../constants';

interface MobileContactsModalProps {
	isOpened: boolean;
	onClose: () => void;
}

export const MobileContactsModal: React.FC<MobileContactsModalProps> = ({ isOpened, onClose }) => {
	const handleOpenYandexMaps = () => {
		const { latitude, longitude } = COMPANY_COORDINATES;
		const yandexMapsUrl = `https://yandex.ru/maps/?pt=${longitude},${latitude}&z=15&l=map&text=${encodeURIComponent(
			COMPANY_ADDRESS
		)}`;
		window.open(yandexMapsUrl, '_blank');
	};

	return (
		<Modal open={isOpened} onClose={onClose}>
			<ModalContainer
				px={1}
				py={1}
				onClose={onClose}
				title='Контакты'
				width='344px'
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					maxHeight: '95vh',
					overflow: 'auto',
					transform: 'translate(-50%, -50%)'
				}}
			>
				<Box mb={1.5} display={'flex'} alignItems={'center'} flexDirection={'column'} gap={1.5}>
					<WorkTimetable />
					<Typography display={'flex'} alignItems='center' gap={1}>
						<Image isOnSSR={false} src='/mts_icon.png' alt='phone' quality={100} width={20} height={20} />{' '}
						<Link href='tel:+375297804780'>+375297804780</Link>
					</Typography>
					<Typography display={'flex'} alignItems='center' gap={1}>
						<Image isOnSSR={false} src='/a1_icon.png' alt='phone' quality={100} width={24} height={24} />{' '}
						<Link href='tel:+375296011602'>+375296011602</Link>
					</Typography>
				</Box>
				<SocialButtons sx={{ justifyContent: 'center' }} data={SOCIAL_BUTTONS_MOBILE} />
				<Box mt={1.5} bgcolor='custom.bg-surface-1' p={1.5} py={1} borderRadius={4}>
					<Typography variant='h6' fontSize={18}>
						Авторазборка Полотково ООО "Дриблинг"
					</Typography>
					<Typography mb={1} variant='body2'>
						Гродненская область, Гродненский район, с/с Коптевский, д. Полотково
					</Typography>
					<iframe
						src='https://yandex.com/map-widget/v1/?um=constructor%3A8e4478010012318b78f66dc37db42cd1a6247bbea253e93b24602e1ac041c3c0&amp;source=constructor'
						width='100%'
						height='304'
					></iframe>
					<Button variant='contained' fullWidth onClick={handleOpenYandexMaps} sx={{ mt: 1 }}>
						Проложить маршрут
					</Button>
				</Box>
			</ModalContainer>
		</Modal>
	);
};
