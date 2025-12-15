import { Box } from '@mui/material';
import { FC } from 'react';
import { Image } from 'shared/ui';
import { PAYMENT_METHODS } from '../footerConstants';

const PaymentMethods: FC = () => (
	<Box
		py={2.5}
		display='flex'
		bgcolor='background.paper'
		justifyContent='center'
		gap={1.5}
		borderRadius={2}
		alignItems='center'
		maxWidth={420}
		width='100%'
		flexWrap='wrap'
		component='section'
		aria-label='Способы оплаты'
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
				style={{ objectFit: 'contain' }}
			/>
		))}
	</Box>
);

export default PaymentMethods;
