import { Box, useMediaQuery } from '@mui/material';
import { fetchPage } from 'api/pages';
import { PageGuarantee } from 'api/pages/types';
import BlockImages from 'components/BlockImages';
import Image from 'components/Image';
import ReactMarkdown from 'components/ReactMarkdown';
import Typography from 'components/Typography';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	page: PageGuarantee;
}

const Guarantee = ({ page }: Props) => {
	console.log(page.mainLeftImage);
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
		<>
			<Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }}>
				<Typography
					variant={'h4'}
					display={{ xs: 'block', sm: 'none' }}
					component='h1'
					marginBottom='0.5em'
					fontWeight='500'
				>
					{page.h1}
				</Typography>
				<Box maxWidth={{ xs: 'initial', sm: 390 }} width='100%'>
					<Image
						title={page.mainLeftImage?.caption}
						src={page.mainLeftImage?.formats?.small?.url || page.mainLeftImage.url}
						width={390}
						style={isMobile ? { height: '100%', width: '100%', objectFit: 'cover' } : { height: 'auto' }}
						height={320}
						alt={page.mainLeftImage?.alternativeText}
					></Image>
				</Box>
				<Box
					minWidth={250}
					sx={{
						marginLeft: { xs: '0', sm: '3em' },
						flex: { xs: 1, md: 'initial' },
						marginTop: { xs: '0.5em', md: 0 }
					}}
				>
					<Typography
						display={{ xs: 'none', sm: 'block' }}
						variant='h4'
						component='h1'
						marginBottom='0.5em'
						fontWeight='500'
					>
						{page.h1}
					</Typography>
					<ReactMarkdown content={page.mainRightText}></ReactMarkdown>
				</Box>
			</Box>
			<BlockImages
				withSlider={isMobile}
				withoutOverlay={isMobile}
				images={page.images1}
				sx={{
					marginY: { xs: '1em', md: '3em' },
					paddingY: { xs: '1em', md: '3em' },
					flexDirection: { xs: 'column', sm: 'row' }
				}}
			></BlockImages>
			<Box sx={{ typography: { xs: 'h5', md: 'h4' } }}>
				<Typography
					withSeparator
					textTransform='uppercase'
					fontWeight='500'
					marginBottom='0.5em'
					variant='inherit'
				>
					{page.guaranteeNotApplyTitle}
				</Typography>
			</Box>
			<Typography>
				<ReactMarkdown content={page.guaranteeNotApplyText}></ReactMarkdown>
			</Typography>
			<BlockImages
				withSlider={isMobile}
				withoutOverlay={isMobile}
				images={page.images2}
				sx={{
					marginY: { xs: '1em', md: '2em' },
					padding: { xs: '1em 0', md: '2em 0' },
					flexDirection: { xs: 'column', sm: 'row' }
				}}
			></BlockImages>
			<Box
				bgcolor='#FFF5DD'
				sx={{ marginBottom: { xs: '1em', sm: '4em' }, padding: { xs: '1em 0.5em', sm: '2em 4em' } }}
			>
				<Box display='flex' alignItems='center'>
					<Box display={{ xs: 'block', sm: 'none' }} marginRight='1em' maxWidth='250px' width='100%'>
						<Image
							title={page.warningLeftImage?.caption}
							src={page.warningLeftImage?.url}
							width={page.warningLeftImage?.width}
							height={page.warningLeftImage?.height}
							alt={page.warningLeftImage?.alternativeText}
						></Image>
					</Box>
					<Box textTransform='uppercase' fontWeight='500' sx={{ typography: { xs: 'h6', sm: 'h6' } }}>
						{page.warningTitle}
					</Box>
				</Box>
				<Box display='flex'>
					<Box display={{ xs: 'none', sm: 'block' }} marginTop='2em' maxWidth='250px' width='100%'>
						<Image
							title={page.warningLeftImage?.caption}
							src={page.warningLeftImage?.url}
							width={page.warningLeftImage?.width}
							height={page.warningLeftImage?.height}
							alt={page.warningLeftImage?.alternativeText}
						></Image>
					</Box>
					<Box component='ul' textTransform='uppercase'>
						{page.warningRightText.split('\n').map((item) => (
							<Typography key={item} variant='h6' fontWeight='normal' component='li' marginY='0.5em'>
								{item}
							</Typography>
						))}
					</Box>
				</Box>
			</Box>
			<ReactMarkdown content={page.content}></ReactMarkdown>
		</>
	);
};

export default Guarantee;

export const getStaticProps = getPageProps(
	fetchPage('guarantee', { populate: ['seo', 'mainLeftImage', 'images1', 'images2', 'warningLeftImage'] })
);
