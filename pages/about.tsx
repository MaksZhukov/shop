import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { PageAbout } from 'api/pages/types';
import Typography from 'components/Typography';
import { Box } from '@mui/system';
import Image from 'components/Image';
import BlockImages from 'components/BlockImages';
import ReactMarkdown from 'components/ReactMarkdown/ReactMarkdown';

interface Props {
	page: PageAbout;
}

const About = ({ page }: Props) => {
	return (
		<>
			<Box display='flex'>
				<Image
					title={page.mainImageLeft?.caption}
					width={page.mainImageLeft?.width}
					height={page.mainImageLeft?.height}
					src={page.mainImageLeft?.url}
					alt={page.mainImageLeft.alternativeText}
				></Image>
				<Box marginLeft='3em'>
					<Typography component='h1' variant='h4' marginBottom='1em' textTransform='uppercase'>
						{page.h1}
					</Typography>
					<Typography>
						<ReactMarkdown content={page.mainTextRight}></ReactMarkdown>
					</Typography>
				</Box>
			</Box>
			<BlockImages images={page.images1}></BlockImages>
			<Box>
				<Typography marginBottom='1em' component='h2' variant='h4' withSeparator textTransform='uppercase'>
					{page.whyNeedServicesTitle}
				</Typography>
				<ReactMarkdown content={page.whyNeedServicesText}></ReactMarkdown>
			</Box>
			<BlockImages sx={{ marginY: '2em' }} withoutOverlay images={page.images2}></BlockImages>
			<ReactMarkdown content={page.whyNeedServicesTextAfterImages2}></ReactMarkdown>
			<Box display='flex' marginBottom='3em'>
				<Box marginRight='3em'>
					<Typography marginBottom='1em' component='h2' variant='h4' withSeparator textTransform='uppercase'>
						{page.mainPrinciplesTitle}
					</Typography>
					<ReactMarkdown content={page.mainPrinciplesTextLeft}></ReactMarkdown>
				</Box>
				<Image
					title={page.mainPrinciplesImageRight?.caption}
					width={page.mainPrinciplesImageRight?.width}
					height={page.mainPrinciplesImageRight?.height}
					src={page.mainPrinciplesImageRight?.url}
					alt={page.mainPrinciplesImageRight.alternativeText}
				></Image>
			</Box>
			<Typography withSeparator component='h2' textTransform='uppercase' marginBottom='1em' variant='h4'>
				{page.nuancesTitle}
			</Typography>
			<ReactMarkdown content={page.nuancesText}></ReactMarkdown>
			<BlockImages images={page.images3}></BlockImages>
			<ReactMarkdown content={page.mainPrinciplesTextAfterImages3}></ReactMarkdown>
			<BlockImages sx={{ margin: '1em 0 3em' }} withoutOverlay images={page.images4}></BlockImages>
			<Box display='flex' marginBottom='3em'>
				<Image
					title={page.pricesLeftImage?.caption}
					width={page.pricesLeftImage?.width}
					height={page.pricesLeftImage?.height}
					src={page.pricesLeftImage?.url}
					alt={page.pricesLeftImage.alternativeText}
				></Image>
				<Box marginTop='4em' marginLeft='3em'>
					<Typography component='h2' variant='h4'>
						{page.pricesTitle}
					</Typography>
					<Typography>
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
