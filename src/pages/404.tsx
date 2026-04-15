import { Box, Button, Container, Typography } from '@mui/material';
import { Image, MobileQuestionsSection } from 'shared/ui';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { useRouter } from 'next/router';

const PageNotFound = () => {
	const router = useRouter();
	return (
        <Box
            sx={{
                margin: 'auto',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
            <Image isOnSSR={false} src='/404.png' alt='404' width={178} height={90} />
            <Typography component='h1' variant='h6' sx={{
                textAlign: 'center'
            }}>
				Страница не найдена
			</Typography>
            <Typography
                variant='body1'
                component='p'
                sx={{
                    color: 'text.primary',
                    mb: 2
                }}>
				Кажется что-то пошло не так, страница не найдена либо не существует
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
