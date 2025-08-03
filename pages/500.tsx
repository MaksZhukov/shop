import { Container, Typography } from '@mui/material';
import WhiteBox from 'components/ui/WhiteBox';
import { getPageProps } from 'services/PagePropsService';

const PageNotFound = () => {
	return (
		<Container>
			<WhiteBox>
				<Typography component='h1' variant='h4' textAlign='center'>
					Ошибка сервера
				</Typography>
			</WhiteBox>
		</Container>
	);
};

export default PageNotFound;

export const getStaticProps = getPageProps();
