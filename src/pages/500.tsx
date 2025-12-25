import { Box, Container, Typography } from '@mui/material';
import { Button, Image, MobileQuestionsSection, WhiteBox } from 'shared/ui';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { useRouter } from 'next/router';

const PageNotFound = () => {
	const router = useRouter();
	return (
		<>
			<Box margin='auto' maxWidth='400px' textAlign='center'>
				<Image isOnSSR={false} src='/500.png' alt='500' width={120} height={104} />
				<Typography component='h1' variant='h6' textAlign='center'>
					Что-то пошло не так
				</Typography>
				<Typography variant='body1' color='text.primary' component='p' mb={2}>
					Техническая ошибка
				</Typography>
				<Button sx={{ m: 'auto' }} variant='contained' color='primary' onClick={() => router.push('/')}>
					Вернуться на главную
				</Button>
			</Box>

			<MobileQuestionsSection />
		</>
	);
};

export default PageNotFound;

export const getStaticProps = getPageProps();
