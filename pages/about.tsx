import { useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { fetchPage } from 'api/pages';
import { PageAbout } from 'api/pages/types';
import BlockImages from 'components/BlockImages';
import Image from 'components/Image';
import ReactMarkdown from 'components/ReactMarkdown/ReactMarkdown';
import Typography from 'components/Typography';
import { getUrlByMinFormat } from 'services/ImageService';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	page: PageAbout;
}

const About = ({ page }: Props) => {
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
		<>
			<Box display='flex' sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
				<Typography
					sx={{ display: { xs: 'block', md: 'none' } }}
					component='h1'
					variant='h4'
					marginBottom='1em'
					textTransform='uppercase'
				>
					{page.h1}
				</Typography>

				<Image
					title={page.mainImageLeft?.caption}
					width={500}
					height={360}
					style={isTablet ? { height: 'auto' } : {}}
					src={getUrlByMinFormat(page.mainImageLeft, 'small')}
					alt={page.mainImageLeft.alternativeText}
				></Image>

				<Box sx={{ marginLeft: { xs: 0, md: '3em' } }}>
					<Typography
						sx={{ display: { xs: 'none', md: 'block' } }}
						component='h1'
						variant='h4'
						marginBottom='1em'
						textTransform='uppercase'
					>
						{page.h1}
					</Typography>

					<Typography sx={{ marginTop: { xs: '1em', md: '0' } }}>
						<ReactMarkdown content={page.mainTextRight}></ReactMarkdown>
					</Typography>
				</Box>
			</Box>
			<BlockImages
				withoutOverlay={isTablet}
				images={page.images1}
				withSlider={isMobile}
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
				withSlider={isMobile}
				images={page.images2}
			></BlockImages>
			<ReactMarkdown content={page.whyNeedServicesTextAfterImages2}></ReactMarkdown>
			<Box display='flex' marginBottom='3em' sx={{ flexDirection: { xs: 'column-reverse', md: 'row' } }}>
				<Box sx={{ marginRight: { xs: 0, md: '3em' }, marginTop: { xs: '1em', md: 0 } }}>
					<Typography
						display={{ xs: 'none', md: 'block' }}
						marginBottom='1em'
						component='h2'
						variant='h4'
						withSeparator
						textTransform='uppercase'
					>
						{page.mainPrinciplesTitle}
					</Typography>

					<ReactMarkdown content={page.mainPrinciplesTextLeft}></ReactMarkdown>
				</Box>
				<Box display={{ xs: 'block', md: 'none' }}>
					<Typography
						sx={{ wordBreak: 'break-word' }}
						marginBottom='1em'
						component='h2'
						variant='h4'
						withSeparator
						textTransform='uppercase'
					>
						{page.mainPrinciplesTitle}
					</Typography>
					<Image
						title={page.mainPrinciplesImageRight?.caption}
						width={500}
						height={360}
						src={getUrlByMinFormat(page.mainPrinciplesImageRight, 'small')}
						alt={page.mainPrinciplesImageRight.alternativeText}
						style={isTablet ? { height: 'auto' } : {}}
					></Image>
				</Box>
				<Box display={{ xs: 'none', md: 'block' }} minWidth='500px'>
					<Image
						title={page.mainPrinciplesImageRight?.caption}
						width={500}
						height={360}
						style={isTablet ? { height: 'auto' } : {}}
						src={getUrlByMinFormat(page.mainPrinciplesImageRight, 'small')}
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
				withSlider={isMobile}
				images={page.images3}
				sx={{ paddingY: { xs: 0, md: '3em' }, marginY: { xs: '1em', md: '2em' } }}
			></BlockImages>
			<ReactMarkdown content={page.mainPrinciplesTextAfterImages3}></ReactMarkdown>
			<BlockImages
				sx={{ paddingY: { xs: 0, md: '3em' }, margin: { xs: '1em 0 3em', md: '1em 0 3em' } }}
				withoutOverlay
				withSlider={isMobile}
				images={page.images4}
			></BlockImages>
			<Box display='flex' marginBottom='3em' sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
				<Typography display={{ xs: 'block', md: 'none' }} marginBottom='1em' component='h2' variant='h4'>
					{page.pricesTitle}
				</Typography>
				<Image
					title={page.pricesLeftImage?.caption}
					width={500}
					height={360}
					src={getUrlByMinFormat(page.pricesLeftImage, 'small')}
					style={isTablet ? { height: 'auto' } : {}}
					alt={page.pricesLeftImage.alternativeText}
				></Image>
				<Box sx={{ margin: { xs: 0, md: '4em 0 0 3em' } }}>
					<Typography display={{ xs: 'none', md: 'block' }} component='h2' variant='h4'>
						{page.pricesTitle}
					</Typography>
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
			'pricesLeftImage'
		]
	})
);
