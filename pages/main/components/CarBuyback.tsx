import { Box, Input, useMediaQuery } from '@mui/material';
import { Button } from 'components/ui';
import { Typography } from 'components/ui';
import { SocialButtons } from 'components/features/SocialsButtons';

export const CarBuyback: React.FC = () => {
	const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));

	return (
		<Box
			minHeight={284}
			mb={5}
			display={'flex'}
			gap={{ xs: 0, md: 5 }}
			py={4}
			px={2}
			width={{ xs: '110%', md: 'auto' }}
			ml={{ xs: '-5%', md: 0 }}
			flexDirection={{ xs: 'column', md: 'row' }}
			alignItems={'center'}
			justifyContent={'center'}
			borderRadius={4}
			bgcolor={'custom.bg-surface-4'}
		>
			<Box maxWidth={340} textAlign={{ xs: 'center', md: 'left' }}>
				<Typography color='text.secondary' variant='h6'>
					Выкуп авто
				</Typography>
				<Typography color='text.primary' mb={2}>
					Оставьте заявку и мы с вами свяжемся для покупки вашего автомобиля{' '}
				</Typography>
				{!isTablet && <SocialButtons />}
			</Box>
			<Box
				maxWidth={300}
				display={'flex'}
				flexDirection={'column'}
				gap={1}
				textAlign={{ xs: 'center', md: 'left' }}
			>
				<Input size='medium' placeholder='Номер телефона'></Input>
				<Button variant='contained'>Оставить заявку</Button>
				<Typography variant='body2' color='custom.text-muted'>
					Нажимая на кнопку вы соглашаетесь на обработку персональных данных
				</Typography>
			</Box>
		</Box>
	);
};
