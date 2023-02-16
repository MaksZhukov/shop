import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { PageAbout } from 'api/pages/types';
import Typography from 'components/Typography';
import { Box } from '@mui/system';
import Image from 'components/Image';
import BlockImages from 'components/BlockImages';
import ReactMarkdown from 'components/ReactMarkdown/ReactMarkdown';
import { useMediaQuery } from '@mui/material';

interface Props {
	page: PageAbout;
}

const About = ({ page }: Props) => {
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	return (
		<>
			<Box display='flex' sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
				{isTablet && (
					<Typography component='h1' variant='h4' marginBottom='1em' textTransform='uppercase'>
						{page.h1}
					</Typography>
				)}
				<Image
					title={page.mainImageLeft?.caption}
					width={page.mainImageLeft?.width}
					height={page.mainImageLeft?.height}
					src={page.mainImageLeft?.url}
					alt={page.mainImageLeft.alternativeText}
				></Image>
				<Box sx={{ marginLeft: { xs: 0, md: '3em' } }}>
					{!isTablet && (
						<Typography component='h1' variant='h4' marginBottom='1em' textTransform='uppercase'>
							{page.h1}
						</Typography>
					)}
					<Typography sx={{ marginTop: { xs: '1em', md: '0' } }}>
						<ReactMarkdown content={page.mainTextRight}></ReactMarkdown>
					</Typography>
				</Box>
			</Box>
			<BlockImages
				withoutOverlay={isTablet}
				images={page.images1}
				sx={{ paddingY: { xs: 0, md: '3em' }, margin: { xs: '1em 0 3em', md: '3em 0' } }}
			></BlockImages>
			<Box>
				<Typography marginBottom='1em' component='h2' variant='h4' withSeparator textTransform='uppercase'>
					{page.whyNeedServicesTitle}
				</Typography>
				<ReactMarkdown content={page.whyNeedServicesText}></ReactMarkdown>
			</Box>
			<BlockImages
				sx={{ paddingY: { xs: 0, md: '3em' }, marginY: { xs: '1em', md: '2em' } }}
				withoutOverlay
				images={page.images2}
			></BlockImages>
			<ReactMarkdown content={page.whyNeedServicesTextAfterImages2}></ReactMarkdown>
			<Box display='flex' marginBottom='3em' sx={{ flexDirection: { xs: 'column-reverse', md: 'row' } }}>
				<Box sx={{ marginRight: { xs: 0, md: '3em' }, marginTop: { xs: '1em', md: 0 } }}>
					{!isTablet && (
						<Typography
							marginBottom='1em'
							component='h2'
							variant='h4'
							withSeparator
							textTransform='uppercase'
						>
							{page.mainPrinciplesTitle}
						</Typography>
					)}
					<ReactMarkdown content={page.mainPrinciplesTextLeft}></ReactMarkdown>
				</Box>
				<Box>
					{isTablet && (
						<Typography
							marginBottom='1em'
							component='h2'
							variant='h4'
							withSeparator
							textTransform='uppercase'
						>
							{page.mainPrinciplesTitle}
						</Typography>
					)}
					<Image
						title={page.mainPrinciplesImageRight?.caption}
						width={page.mainPrinciplesImageRight?.width}
						height={page.mainPrinciplesImageRight?.height}
						src={page.mainPrinciplesImageRight?.url}
						alt={page.mainPrinciplesImageRight.alternativeText}
					></Image>
				</Box>
			</Box>
			<Typography withSeparator component='h2' textTransform='uppercase' marginBottom='1em' variant='h4'>
				{page.nuancesTitle}
			</Typography>
			<ReactMarkdown content={page.nuancesText}></ReactMarkdown>
			<BlockImages
				withoutOverlay={isTablet}
				images={page.images3}
				sx={{ paddingY: { xs: 0, md: '3em' }, marginY: { xs: '1em', md: '2em' } }}
			></BlockImages>
			<ReactMarkdown content={page.mainPrinciplesTextAfterImages3}></ReactMarkdown>
			<BlockImages
				sx={{ paddingY: { xs: 0, md: '3em' }, margin: { xs: '1em 0 3em', md: '1em 0 3em' } }}
				withoutOverlay
				images={page.images4}
			></BlockImages>
			<Box display='flex' marginBottom='3em' sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
				{isTablet && (
					<Typography marginBottom='1em' component='h2' variant='h4'>
						{page.pricesTitle}
					</Typography>
				)}
				<Image
					title={page.pricesLeftImage?.caption}
					width={page.pricesLeftImage?.width}
					height={page.pricesLeftImage?.height}
					src={page.pricesLeftImage?.url}
					alt={page.pricesLeftImage.alternativeText}
				></Image>
				<Box sx={{ margin: { xs: 0, md: '4em 0 0 3em' } }}>
					{!isTablet && (
						<Typography component='h2' variant='h4'>
							{page.pricesTitle}
						</Typography>
					)}
					<Typography sx={{ marginTop: { xs: '1em', md: 0 } }}>
						<ReactMarkdown content={page.pricesRightText}></ReactMarkdown>
					</Typography>
				</Box>
			</Box>
			<ReactMarkdown content={page.content}></ReactMarkdown>
		</>
	);
};

export default About;

export const getStaticProps = getPageProps(
	fetchPage('about', {
		populate: [
			'seo',
			'mainImageLeft',
			'images1',
			'images2',
			'mainPrinciplesImageRight',
			'images3',
			'images4',
			'pricesLeftImage',
		],
	})
);
