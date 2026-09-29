import { Typography } from 'shared/ui';

type PaymentHeaderProps = {
	title: string;
};

export const PaymentHeader = ({ title }: PaymentHeaderProps) => (
	<Typography component='h1' variant='h4' align='center' sx={{ mb: '1em', textTransform: 'uppercase' }}>
		{title}
	</Typography>
);
