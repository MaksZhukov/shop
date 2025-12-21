import { Box, Typography } from '@mui/material';
import { Button } from 'shared/ui';
import NextImage from 'next/image';
import { useRouter } from 'next/router';

export const EmptyCart = () => {
	const router = useRouter();
	const handleStartShopping = () => {
		router.push('/spare-parts');
	};

	return (
		<Box py={5} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
			<NextImage src='/basket.png' alt='Корзина' width={144} height={136} />
			<Typography variant='h6' fontSize='18px' mt={2}>
				В корзине пока пусто
			</Typography>
			<Typography mb={2} textAlign='center' variant='body1'>
				Воспользуйтесь поиском, чтобы найти всё, что вам нужно
			</Typography>
			<Button variant='contained' color='primary' onClick={handleStartShopping}>
				Начать покупки
			</Button>
		</Box>
	);
};
