import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { fetchPageContacts } from 'api/pageContacts/pageContacts';
import { PageContacts } from 'api/pageContacts/types';
import HeadSEO from 'components/HeadSEO';
import WhiteBox from 'components/WhiteBox';
import Image from 'next/image';
import { getPageProps } from 'services/PagePropsService';
import SEOBox from 'components/SEOBox';

interface Props {
	page: PageContacts;
}

const Contacts = ({ page }: Props) => {
	return (
		<>
			<HeadSEO
				title={page.seo?.title || 'Контакты'}
				description={page.seo?.description || 'Наши контакты'}
				keywords={page.seo?.keywords || 'контакты, контакты разбор авто, разбор авто'}
			></HeadSEO>
			<Container>
				<WhiteBox>
					<Typography component='h1' variant='h4' textAlign='center'>
						{page.seo?.h1 || 'О нас'}
					</Typography>
					<Typography textAlign='center' variant='h6'>
						Время работы:
					</Typography>
					<Typography textAlign='center' marginLeft='2em' variant='subtitle1'>
						Понедельник - Пятница: 10:00-18:00
					</Typography>
					<Typography textAlign='center' marginLeft='2em' variant='subtitle1'>
						Суббота - Воскресенье: 10:00-14:00
					</Typography>
					<Box textAlign='center'>
						<Image alt='Путь' width={390} height={685} src={'/route.png'}></Image>
					</Box>
				</WhiteBox>
				<SEOBox images={page.seo?.images} content={page.seo?.content}></SEOBox>
			</Container>
		</>
	);
};

export default Contacts;

export const getStaticProps = getPageProps(fetchPageContacts);
