import { Box, Typography, useMediaQuery } from '@mui/material';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import { Image } from 'api/types';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { getPageProps } from 'services/PagePropsService';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface Props {
	page: DefaultPage & { map: string; text: string; video: Image };
}

const HowToGetTo: FC<Props> = ({ page }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
		<>
			<Typography marginBottom='1em' component='h1' textTransform='uppercase' variant='h4' textAlign='center'>
				{page.seo?.h1}
			</Typography>
			<Box display='flex' gap='3em' marginBottom='2em' sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
				<Box flex='1'>{/* <ReactMarkdown content={page.text}></ReactMarkdown> */}</Box>
				<Box width={{ xs: '100%', sm: 400 }}>
					{/* <ReactPlayer width={isMobile ? '100%' : 350} height={400} url={page.video.url}></ReactPlayer> */}
				</Box>
			</Box>
			{/* <Box dangerouslySetInnerHTML={{ __html: page.map }}></Box> */}
		</>
	);
};

export default HowToGetTo;

export const getStaticProps = getPageProps(fetchPage('how-to-get-to'));
