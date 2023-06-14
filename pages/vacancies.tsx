import { Table, TableBody, TableCell, TableRow, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { fetchPage } from 'api/pages';
import { PageVacancies, Vacancy } from 'api/pages/types';
import BlockImages from 'components/BlockImages';
import Image from 'components/Image';
import Typography from 'components/Typography';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	page: PageVacancies;
}

const Vacancies: NextPage<Props> = ({ page }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	let renderVacancy = (item: Vacancy, index: number) => {
		return (
			<>
				<Box key={item.id} display='flex' flexDirection={{ xs: 'column', md: 'row' }}>
					<Typography
						sx={{ display: { xs: 'block', md: 'none' } }}
						marginBottom='1em'
						component={index === 0 ? 'h1' : 'h2'}
						variant='h4'
						textTransform='uppercase'
						fontWeight='500'
					>
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
					<Box paddingLeft={{ xs: '0', md: '3em' }} marginTop={{ xs: '1em', md: 0 }}>
						<Typography
							sx={{ display: { xs: 'none', md: 'block' } }}
							marginBottom='1em'
							component={index === 0 ? 'h1' : 'h2'}
							variant='h4'
							textTransform='uppercase'
							fontWeight='500'
						>
							{item.title}
						</Typography>
						<Typography
							marginBottom={{ xs: 0, md: '2em' }}
							color='text.secondary'
							variant='h5'
							textTransform='uppercase'
						>
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
											<Typography fontWeight='500'>{option.value}</Typography>
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
						marginBottom={{ xs: '1em', md: '2em' }}
						component='h2'
						textTransform='uppercase'
						fontWeight='500'
						variant='inherit'
						withSeparator
					>
						{item.fullTitle}
					</Typography>
				</Box>
				<Box display='flex' marginBottom={{ xs: '3em', md: '4em' }} flexDirection={{ xs: 'column', md: 'row' }}>
					<Box flex='1' paddingRight={{ xs: 0, md: '5em' }}>
						<Typography color='text.secondary' variant='h6' textTransform='uppercase'>
							Обязаности
						</Typography>
						<Box component='ul' paddingLeft={{ xs: '2em', md: '0' }}>
							{item.responsibilities.split('\n').map((val) => (
								<Typography marginBottom='1em' key={val} component='li'>
									{val}
								</Typography>
							))}
						</Box>
						<Box marginTop='2em' display={{ xs: 'none', md: 'flex' }} justifyContent='center'>
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
					<Box flex='1' paddingRight={{ xs: '0', md: '10em' }}>
						<Typography color='text.secondary' variant='h6' textTransform='uppercase'>
							Требования
						</Typography>
						<Box component='ul' paddingLeft={{ xs: '2em', md: '0' }}>
							{item.requirements.split('\n').map((val) => (
								<Typography marginBottom='1em' key={val} component='li'>
									{val}
								</Typography>
							))}
						</Box>
					</Box>
					<Box marginTop='2em' display={{ xs: 'block', md: 'none' }} justifyContent='center'>
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
	fetchPage('vacancy', { populate: ['vacancies.image', 'vacancies.images', 'seo', 'vacancies.description'] })
);
