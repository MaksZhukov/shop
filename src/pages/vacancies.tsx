import { Table, TableBody, TableCell, TableRow, useMediaQuery } from '@mui/material';
import { Box } from '@mui/material';
import { pageApi, PageVacancies, Vacancy } from 'entities/page';
import { BlockImages } from 'shared/ui';
import { Image } from 'shared/ui';
import { Typography } from 'shared/ui';
import { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: PageVacancies;
}

const Vacancies: NextPage<Props> = ({ page }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	let renderVacancy = (item: Vacancy, index: number) => {
		return (
            <>
                <Box
                    key={item.id}
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' }
                    }}>
					<Typography
						component={index === 0 ? 'h1' : 'h2'}
						variant='h4'
						sx={{
							display: { xs: 'block', md: 'none' },
							mb: '1em',
							textTransform: 'uppercase',
							fontWeight: 500
						}}>
						{item.title}
					</Typography>
					<Image
						title={item.image.caption}
						src={item.image?.url}
						alt={item.image.alternativeText}
						width={500}
						height={360}
						style={isMobile ? { height: 'auto' } : {}}
					></Image>
					<Box
                        sx={{
                            paddingLeft: { xs: '0', md: '3em' },
                            marginTop: { xs: '1em', md: 0 }
                        }}>
						<Typography
							component={index === 0 ? 'h1' : 'h2'}
							variant='h4'
							sx={{
								display: { xs: 'none', md: 'block' },
								mb: '1em',
								textTransform: 'uppercase',
								fontWeight: 500
							}}>
							{item.title}
						</Typography>
						<Typography
							color='text.secondary'
							variant='h5'
							sx={{ mb: { xs: 0, md: '2em' }, textTransform: 'uppercase' }}>
							{item.vacancy}
						</Typography>
						<Table>
							<TableBody>
								{item.description.map((option) => (
									<TableRow key={option.value}>
										<TableCell
											sx={{
												border: 'none',
												padding: '0.5em 0 0.5em 0',
												width: { xs: '50%', md: 300 }
											}}
											padding='none'
										>
											<Typography>{option.label}</Typography>
										</TableCell>
										<TableCell sx={{ border: 'none', padding: '0.5em 0 0.5em 0' }} padding='none'>
											<Typography sx={{ fontWeight: 500 }}>{option.value}</Typography>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Box>
				</Box>
                <BlockImages
					sx={{
						marginY: { xs: '1em', md: '2em' },
						padding: { xs: '1em 0', md: '2em 0' }
					}}
					withoutOverlay={isMobile}
					withSlider={isMobile}
					images={item.images}
				></BlockImages>
                <Box sx={{ typography: { xs: 'h6', md: 'h5' } }}>
					<Typography
						component='h2'
						variant='inherit'
						sx={{
							mb: { xs: '1em', md: '2em' },
							textTransform: 'uppercase',
							fontWeight: 500
						}}>
						{item.fullTitle}
					</Typography>
				</Box>
                <Box
                    sx={{
                        display: 'flex',
                        marginBottom: { xs: '3em', md: '4em' },
                        flexDirection: { xs: 'column', md: 'row' }
                    }}>
					<Box
                        sx={{
                            flex: '1',
                            paddingRight: { xs: 0, md: '5em' }
                        }}>
						<Typography color='text.secondary' variant='h6' sx={{ textTransform: 'uppercase' }}>
							Обязаности
						</Typography>
						<Box component='ul' sx={{
                            paddingLeft: { xs: '2em', md: '0' }
                        }}>
							{item.responsibilities?.split('\n').map((val) => (
								<Typography key={val} component='li' sx={{ mb: '1em' }}>
									{val}
								</Typography>
							))}
						</Box>
						<Box
                            sx={{
                                marginTop: '2em',
                                display: { xs: 'none', md: 'flex' },
                                justifyContent: 'center'
                            }}>
							<Image
								src='/logo_medium.png'
								isOnSSR={false}
								width={315}
								height={87}
								alt='Разборка авто вакансия'
								title='Разборка авто вакансия'
							></Image>
						</Box>
					</Box>
					<Box
                        sx={{
                            flex: '1',
                            paddingRight: { xs: '0', md: '10em' }
                        }}>
						<Typography color='text.secondary' variant='h6' sx={{ textTransform: 'uppercase' }}>
							Требования
						</Typography>
						<Box component='ul' sx={{
                            paddingLeft: { xs: '2em', md: '0' }
                        }}>
							{item.requirements?.split('\n').map((val) => (
								<Typography key={val} component='li' sx={{ mb: '1em' }}>
									{val}
								</Typography>
							))}
						</Box>
					</Box>
					<Box
                        sx={{
                            marginTop: '2em',
                            display: { xs: 'block', md: 'none' },
                            justifyContent: 'center'
                        }}>
						<Image
							src='/logo_medium.png'
							isOnSSR={false}
							width={315}
							height={87}
							alt='Разборка авто вакансия'
							title='Разборка авто вакансия'
						></Image>
					</Box>
				</Box>
            </>
        );
	};
	return <>{page.vacancies.map(renderVacancy)}</>;
};

export default Vacancies;

export const getStaticProps = getPageProps(
	pageApi.fetchPage('vacancy', { populate: ['vacancies.image', 'vacancies.images', 'seo', 'vacancies.description'] }),
	async () => {
		return {
			props: {
				breadcrumbs: [
					{ text: 'Главная', href: '/' },
					{ text: 'Вакансии', href: '/vacancies' }
				]
			}
		};
	}
);
