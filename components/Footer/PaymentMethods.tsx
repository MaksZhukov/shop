import { Box } from '@mui/material';
import { FC } from 'react';
import Image from 'components/Image';

const PaymentMethods: FC = () => (
	<Box height={100} width={340} overflow='auto'>
		<Image
			title='Bepaid карточки'
			alt='Bepaid карточки'
			isOnSSR={false}
			src='/be_paid_cards.png'
			width={1452}
			height={100}
			style={{ objectFit: 'none', objectPosition: 'left' }}
		/>
	</Box>
);

export default PaymentMethods;
