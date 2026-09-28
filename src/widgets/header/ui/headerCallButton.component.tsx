import { Button } from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';

export const HeaderCallButton: FC = () => (
	<NextLink href='/contacts' style={{ textDecoration: 'none', flexShrink: 0 }}>
		<Button variant='outlined' size='small' color='primary'>
			ЗАКАЗАТЬ ЗВОНОК
		</Button>
	</NextLink>
);
