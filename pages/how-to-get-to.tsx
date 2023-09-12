import { Box, Typography, useMediaQuery } from '@mui/material';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import { Video } from 'api/types';
import ReactMarkdown from 'components/ReactMarkdown';
import getConfig from 'next/config';
import { FC } from 'react';
import ReactPlayer from 'react-player';
import { getPageProps } from 'services/PagePropsService';
const { publicRuntimeConfig } = getConfig();

interface Props {
	page: DefaultPage & { content: string; text: string; video: Video };
}

const HowToGetTo: FC<Props> = ({ page }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
		<>
			<Typography marginBottom='1em' component='h1' textTransform='uppercase' variant='h4' textAlign='center'>
				{page.seo?.h1}
			</Typography>
			<Box display='flex' gap='2em' marginBottom='2em' sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
				<Box flex='1'>
					<ReactMarkdown content={page.text}></ReactMarkdown>
				</Box>
				<Box width={{ xs: '100%', sm: 250 }} margin='auto'>
					<ReactPlayer
						controls
						style={{ margin: 'auto' }}
						width={isMobile ? '100%' : 230}
						height={isMobile ? 'auto' : 400}
						url={publicRuntimeConfig.backendUrl + page.video.url}
					></ReactPlayer>
				</Box>
			</Box>
			<iframe
				src='https://yandex.ru/map-widget/v1/?um=constructor%3Aa553e2f9544eb2f0c9143e3fc50b1dd10fc059188ae131165b0455a4ff8c645b&source=constructor'
				width='100%'
				height='400px'
				frameBorder={0}
			></iframe>
		</>
	);
};

export default HowToGetTo;

export const getStaticProps = getPageProps(fetchPage('how-to-get-to'));
