import { Container, Typography } from '@mui/material';
import { WhiteBox } from 'components/ui';
import { getPageProps } from 'services/PagePropsService';

const PageNotFound = () => {
	return (
		<Container>
			<Typography p={6} component='h1' variant='h4' textAlign='center'>
				Страница не найдена
			</Typography>
		</Container>
	);
};

export default PageNotFound;

export const getStaticProps = getPageProps();
