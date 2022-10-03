import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { addReview } from 'api/reviews/reviews';
import WhiteBox from 'components/WhiteBox';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import Image from 'next/image';

const Contacts = () => {
	return (
		<>
			<Head>
				<title>Контакты</title>
				<meta name='description' content='Наши контакты'></meta>
				<meta
					name='keywords'
					content='контакты, контакты разбор авто, разбор авто'
				/>
			</Head>
			<Container>
				<WhiteBox>
					<Typography component='h1' variant='h4' textAlign='center'>
						О нас
					</Typography>
					<Typography textAlign='center' variant='h6'>
						Время работы:
					</Typography>
					<Typography
						textAlign='center'
						marginLeft='2em'
						variant='subtitle1'>
						Понедельник - Пятница: 10:00-18:00
					</Typography>
					<Typography
						textAlign='center'
						marginLeft='2em'
						variant='subtitle1'>
						Суббота - Воскресенье: 10:00-14:00
					</Typography>
					<Box textAlign='center'>
						<Image
							alt='Путь'
							width={390}
							height={685}
							src={'/route.png'}></Image>
					</Box>
				</WhiteBox>
			</Container>
		</>
	);
};

export default Contacts;

export async function getStaticProps() {
	return { props: {} };
}
