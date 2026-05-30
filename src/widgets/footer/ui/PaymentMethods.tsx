import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { Image } from 'shared/ui';
import { PAYMENT_METHODS } from '../footerConstants';

export const PaymentMethods: FC = () => (
	<Box
		component='section'
		aria-label='Способы оплаты'
		sx={{
			display: 'flex',
			flexDirection: { xs: 'column', md: 'row' },
			alignItems: { xs: 'center', md: 'center' },
			gap: { xs: 2, md: 3 },
			py: { xs: 2.5, md: 3 },
			textAlign: { xs: 'center', md: 'left' }
		}}
	>
		<Typography variant='body2' color='text.primary' sx={{ flexShrink: 0, width: { xs: '100%', md: '100px' } }}>
			Мы принимаем к оплате:
		</Typography>
		<Box
			sx={{
				display: 'flex',
				flexWrap: 'wrap',
				alignItems: 'center',
				justifyContent: { xs: 'center', md: 'flex-end' },
				gap: { xs: 1.5, md: 4 },
				flexShrink: 0
			}}
		>
			{PAYMENT_METHODS.map((method) => (
				<Image
					key={method.name}
					title={method.name}
					alt={`Логотип ${method.name}`}
					isOnSSR={false}
					src={method.src}
					width={method.width}
					height={method.height}
					style={{ objectFit: 'contain', flexShrink: 0 }}
				/>
			))}
		</Box>
	</Box>
);
