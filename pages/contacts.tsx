import { Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { fetchPageContacts } from 'api/pageContacts/pageContacts';
import { PageContacts } from 'api/pageContacts/types';
import HeadSEO from 'components/HeadSEO';
import WhiteBox from 'components/WhiteBox';
import Image from 'next/image';
import { getStaticPageProps } from 'services/StaticPropsService';
import SEOBox from 'components/SEOBox';

interface Props {
	data: PageContacts;
}

const Contacts = ({ data }: Props) => {
	return (
		<>
			<HeadSEO
				title={data.seo?.title || 'Контакты'}
				description={data.seo?.description || 'Наши контакты'}
				keywords={
					data.seo?.keywords ||
					'контакты, контакты разбор авто, разбор авто'
				}></HeadSEO>
			<Container>
				<WhiteBox>
					<Typography component='h1' variant='h4' textAlign='center'>
						{data.seo?.h1 || 'О нас'}
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
				<SEOBox
					images={data.seo?.images}
					content={data.seo?.content}></SEOBox>
			</Container>
		</>
	);
};

export default Contacts;

export const getStaticProps = getStaticPageProps(fetchPageContacts);
