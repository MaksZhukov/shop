import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { fetchPageContact } from 'api/pageContact/pageContact';
import { Contact } from 'api/pageContact/types';
import WhiteBox from 'components/WhiteBox';
import Head from 'next/head';
import Image from 'next/image';

interface Props {
	data: Contact;
}

const Contacts = ({ data }: Props) => {
	return (
		<>
			<Head>
				<title>{data.seo?.title || 'Контакты'}</title>{' '}
				<meta
					name='description'
					content={data.seo?.description || 'Наши контакты'}></meta>
				<meta
					name='keywords'
					content={
						data.seo?.keywords ||
						'контакты, контакты разбор авто, разбор авто'
					}
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
	let data = { seo: {} } as Contact;

	try {
		const response = await fetchPageContact();
		data = response.data.data;
	} catch (err) {
		console.log(err);
	}
	return { props: { data } };
}
