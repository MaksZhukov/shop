import { Box, Typography, useMediaQuery } from '@mui/material';
import { pageApi, DefaultPage } from 'entities/page';
import type { Video } from 'shared/api/types';
import { ReactMarkdown } from 'shared/ui';
import { FC } from 'react';
import dynamic from 'next/dynamic';
import { getPageProps } from 'shared/utils/pagePropsUtils';
import { backendUrl } from 'shared/services/EnvService';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface Props {
	page: DefaultPage & { content: string; text: string; video: Video };
}

const HowToGetTo: FC<Props> = ({ page }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
        <>
            <Typography
                component='h1'
                variant='h4'
                sx={{
                    marginBottom: '1em',
                    textTransform: 'uppercase',
                    textAlign: 'center'
                }}>
				{page.seo?.h1}
			</Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: '2em',
                    marginBottom: '2em',
                    flexWrap: { xs: 'wrap', md: 'nowrap' }
                }}>
				<Box sx={{
                    flex: '1'
                }}>
					<ReactMarkdown content={page.text}></ReactMarkdown>
				</Box>
				<Box
                    sx={{
                        width: { xs: '100%', sm: 250 },
                        margin: 'auto'
                    }}>
					<ReactPlayer
						controls
						style={{ margin: 'auto' }}
						width={isMobile ? '100%' : 230}
						height={isMobile ? 'auto' : 400}
						src={backendUrl + page.video.url}
					></ReactPlayer>
				</Box>
			</Box>
            <iframe
				src='https://yandex.ru/map-widget/v1/?um=constructor%3Aa553e2f9544eb2f0c9143e3fc50b1dd10fc059188ae131165b0455a4ff8c645b&source=constructor'
				width='100%'
				loading='lazy'
				height='400px'
				frameBorder={0}
			></iframe>
        </>
    );
};

export default HowToGetTo;

export const getStaticProps = getPageProps(pageApi.fetchPage('how-to-get-to'), async () => {
	return {
		props: {
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'Как добраться', href: '/how-to-get-to' }
			]
		}
	};
});
