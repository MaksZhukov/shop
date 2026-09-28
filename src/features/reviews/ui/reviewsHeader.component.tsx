import { Typography } from 'shared/ui';

type ReviewsHeaderProps = {
	title: string;
};

export const ReviewsHeader = ({ title }: ReviewsHeaderProps) => (
	<Typography component='h1' variant='h4' align='center' sx={{ mb: '1em', textTransform: 'uppercase' }}>
		{title}
	</Typography>
);
