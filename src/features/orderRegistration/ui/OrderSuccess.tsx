import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { Image } from 'shared/ui';
import { useRouter } from 'next/router';

export const OrderSuccess = () => {
	const router = useRouter();
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

	return (
		<Box maxWidth='400px' margin='auto' py={3} textAlign='center'>
			<Image
				isOnSSR={false}
				src={'/success_order_check.png'}
				alt='Order success'
				width={isMobile ? 88 : 120}
				height={isMobile ? 83 : 113}
			/>
			<Typography variant='h6' component='h1'>
				Спасибо за заказ
			</Typography>
			<Typography variant='body1' color='text.primary' component='p' mb={2}>
				Заказ оформлен. Наш менеджер свяжется с вами в ближайшее время для уточнения всех подробностей по
				заказу
			</Typography>
			<Button variant='contained' color='primary' onClick={() => router.push('/')}>
				Продолжить покупки
			</Button>
		</Box>
	);
};

