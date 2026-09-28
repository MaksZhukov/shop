import { Typography } from '@mui/material';

type ServiceStationsHeaderProps = {
	title: string;
};

export const ServiceStationsHeader = ({ title }: ServiceStationsHeaderProps) => (
	<Typography
		component='h1'
		variant='h4'
		sx={{
			textAlign: 'center',
			marginBottom: '1em'
		}}
	>
		{title}
	</Typography>
);
