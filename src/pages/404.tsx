import { Box, Button, Container, Typography } from '@mui/material';
import { MobileQuestionsSection } from 'shared/ui';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { useRouter } from 'next/router';

const PageNotFound = () => {
	const router = useRouter();
	return (
		<Box p={6} display='flex' flexDirection='column' alignItems='center' gap={2} justifyContent='center'>
			<Typography component='h1' variant='h6' textAlign='center'>
				Страница не найдена
			</Typography>
			<Button sx={{ m: 'auto' }} variant='contained' color='primary' onClick={() => router.push('/')}>
				Вернуться на главную
			</Button>
			<MobileQuestionsSection />
		</Box>
	);
};

export default PageNotFound;

export const getStaticProps = getPageProps();
