import { Box, Typography, Input, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { ChangeEvent } from 'react';
import { WhiteBox } from 'shared/ui';
import { InfoIcon } from 'shared/icons';
import { MobileContactsModal } from 'widgets/header/ui/MobileContactsModal';
import { useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import type { OrderRegistrationFormData, DeliveryMethod } from '../types';

interface DeliveryMethodFormProps {
	formData: OrderRegistrationFormData;
	onDeliveryMethodChange: (deliveryMethod: DeliveryMethod) => void;
	onFieldChange: <K extends keyof OrderRegistrationFormData>(field: K, value: OrderRegistrationFormData[K]) => void;
}

export const DeliveryMethodForm = ({ formData, onDeliveryMethodChange, onFieldChange }: DeliveryMethodFormProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [isMobileContactsModalOpen, setIsMobileContactsModalOpen] = useState<boolean>(false);

	const handleOpenMapAndSchedule = () => {
		setIsMobileContactsModalOpen(true);
	};

	const handleCloseMobileContactsModal = () => {
		setIsMobileContactsModalOpen(false);
	};

	return (
		<>
			<WhiteBox p={2}>
				<Typography variant='h6' component='h2' mb={1}>
					Способ получения
				</Typography>
				<FormControl component='fieldset' sx={{ mb: 1, width: '100%' }}>
					<RadioGroup
						row
						value={formData.deliveryMethod}
						onChange={(e) => onDeliveryMethodChange(e.target.value as DeliveryMethod)}
					>
						<FormControlLabel value='delivery' control={<Radio />} label='Доставка' />
						<FormControlLabel value='pickup' control={<Radio />} label='Самовывоз' />
					</RadioGroup>
				</FormControl>
				{formData.deliveryMethod === 'pickup' && (
					<>
						{isMobile && (
							<Box mt={1} mb={2}>
								<Typography variant='body2' color='custom.text-muted' mb={1}>
									Гродненский район, д.Полотково
								</Typography>
								<Typography
									component='a'
									variant='body2'
									color='primary'
									sx={{ cursor: 'pointer', textDecoration: 'underline' }}
									onClick={handleOpenMapAndSchedule}
								>
									Адрес на карте и режим работы
								</Typography>
							</Box>
						)}
						<Box maxWidth='480px' py={1} bgcolor='custom.bg-surface-1' mb={2} px={1.5} borderRadius={2}>
							<Typography variant='body2' color='custom.text-muted'>
								После оплаты с вами свяжется менеджер и уточнит детали заказа
							</Typography>
						</Box>
						<Box maxWidth='480px' display='flex' flexDirection='column' gap={2} mb={2}>
							<Input
								fullWidth
								placeholder='Комментарий к заказу'
								multiline
								value={formData.comment}
								size='medium'
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									onFieldChange('comment', e.target.value)
								}
								sx={{ bgcolor: 'background.paper', padding: '0.5em 1em' }}
							/>
						</Box>
						<Box maxWidth='480px' display='flex' alignItems='center' gap={1}>
							<InfoIcon />
							<Typography variant='body2' color='text.secondary'>
								Информация о гарантии{' '}
								<Typography
									component='span'
									color='primary'
									sx={{ cursor: 'pointer', textDecoration: 'underline' }}
								>
									Подробнее
								</Typography>
							</Typography>
						</Box>
					</>
				)}
				{formData.deliveryMethod === 'delivery' && (
					<>
						<Box maxWidth='480px' py={1} px={1.5} borderRadius={2} bgcolor='custom.bg-surface-1' mb={2}>
							<Typography variant='body2' color='custom.text-muted'>
								Способы и условия доставки уточнит менеджер после заказа в рабочее время
							</Typography>
						</Box>
						<Box maxWidth='480px' display='flex' flexDirection='column' gap={2} mb={2}>
							<Input
								fullWidth
								placeholder='Адрес *'
								value={formData.address}
								size='medium'
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									onFieldChange('address', e.target.value)
								}
								sx={{ bgcolor: 'background.paper', padding: '0.5em 1em' }}
								required
							/>
							<Input
								fullWidth
								placeholder='Комментарий к заказу'
								multiline
								value={formData.comment}
								size='medium'
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									onFieldChange('comment', e.target.value)
								}
								sx={{ bgcolor: 'background.paper', padding: '0.5em 1em' }}
							/>
						</Box>
						<Box maxWidth='480px' display='flex' alignItems='center' gap={1}>
							<InfoIcon />
							<Typography variant='body2' color='text.secondary'>
								Информация про доставку и гарантию{' '}
								<Typography component='span' color='info.main' sx={{ cursor: 'pointer' }}>
									Подробнее
								</Typography>
							</Typography>
						</Box>
					</>
				)}
			</WhiteBox>
			<MobileContactsModal isOpened={isMobileContactsModalOpen} onClose={handleCloseMobileContactsModal} />
		</>
	);
};
