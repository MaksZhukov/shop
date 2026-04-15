import { Box, useMediaQuery } from '@mui/material';
import { pageApi, PageGuarantee } from 'entities/page';
import { BlockImages } from 'shared/ui';
import { Image } from 'shared/ui';
import { ReactMarkdown } from 'shared/ui';
import { Typography } from 'shared/ui';
import { getUrlByMinFormat } from 'shared/utils/imageUtils';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: PageGuarantee;
}

const Guarantee = ({ page }: Props) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
				<Typography
					variant='h4'
					component='h1'
					sx={{
						display: { xs: 'block', sm: 'none' },
						mb: '0.5em',
						fontWeight: 500
					}}>
					{page.h1}
				</Typography>
				<Box
                    sx={{
                        maxWidth: { xs: 'initial', sm: 390 },
                        width: '100%'
                    }}>
					<Image
						title={page.mainLeftImage?.caption}
						src={getUrlByMinFormat(page.mainLeftImage, 'small')}
						width={390}
						style={isMobile ? { height: '100%', width: '100%', objectFit: 'cover' } : { height: 'auto' }}
						height={320}
						alt={page.mainLeftImage?.alternativeText}
					></Image>
				</Box>
				<Box
                    sx={{
                        minWidth: 250,
                        marginLeft: { xs: '0', sm: '3em' },
                        flex: { xs: 1, md: 'initial' },
                        marginTop: { xs: '0.5em', md: 0 }
                    }}>
					<Typography
						variant='h4'
						component='h1'
						sx={{
							display: { xs: 'none', sm: 'block' },
							mb: '0.5em',
							fontWeight: 500
						}}>
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
				<Typography variant='inherit' sx={{ textTransform: 'uppercase', fontWeight: 500, mb: '0.5em' }}>
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
                sx={{
                    bgcolor: '#FFF5DD',
                    marginBottom: { xs: '1em', sm: '4em' },
                    padding: { xs: '1em 0.5em', sm: '2em 4em' }
                }}>
				<Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: { xs: 'column', md: 'row' }
                    }}>
					<Box
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            marginRight: '1em',
                            maxWidth: '250px',
                            maxHeight: '250px',
                            width: '100%'
                        }}>
						<Image
							title={page.warningLeftImage?.caption}
							src={page.warningLeftImage?.url}
							width={190}
							style={{ height: 'auto' }}
							height={190}
							alt={page.warningLeftImage?.alternativeText}
						></Image>
					</Box>
					<Box
                        sx={{
                            textTransform: 'uppercase',
                            fontWeight: '500',
                            typography: { xs: 'h6', sm: 'h6' }
                        }}>
						{page.warningTitle}
					</Box>
				</Box>
				<Box sx={{
                    display: 'flex'
                }}>
					<Box
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            marginTop: '2em',
                            maxWidth: '250px',
                            width: '100%'
                        }}>
						<Image
							title={page.warningLeftImage?.caption}
							src={page.warningLeftImage?.url}
							width={page.warningLeftImage?.width}
							height={page.warningLeftImage?.height}
							alt={page.warningLeftImage?.alternativeText}
						></Image>
					</Box>
					<Box component='ul' sx={{
                        textTransform: 'uppercase'
                    }}>
						{page.warningRightText.split('\n').map((item) => (
							<Typography key={item} variant='h6' component='li' sx={{ fontWeight: 'normal', my: '0.5em' }}>
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
	pageApi.fetchPage('guarantee', { populate: ['seo', 'mainLeftImage', 'images1', 'images2', 'warningLeftImage'] }),
	async () => {
		return {
			props: {
				breadcrumbs: [
					{ text: 'Главная', href: '/' },
					{ text: 'Гарантия', href: '/guarantee' }
				]
			}
		};
	}
);
