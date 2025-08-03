import { FC } from 'react';

import { SxProps, Table, TableBody, TableCell, TableRow, useMediaQuery } from '@mui/material';
import { Box } from '@mui/material';
import { fetchPage } from 'api/pages';
import { PageDelivery } from 'api/pages/types';
import BlockImages from 'components/BlockImages';
import Image from 'components/features/Image';
import ReactMarkdown from 'components/ReactMarkdown';
import Typography from 'components/ui/Typography';
import { getUrlByMinFormat } from 'services/ImageService';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	page: PageDelivery;
}

const Delivery: FC<Props> = ({ page }) => {
	const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const renderH1 = (sx: SxProps) => (
		<Box sx={sx} fontWeight='500' textTransform='uppercase' marginBottom='1em' component='h1'>
			{page.h1}
		</Box>
	);
	return (
		<>
			<Box
				display='flex'
				sx={{ marginBottom: { xs: '1em', md: '' }, flexDirection: { xs: 'column', md: 'row' } }}
			>
				{renderH1({ display: { xs: 'block', md: 'none' }, typography: 'h4', marginBottom: '1em' })}
				<Image
					title={page.mainImageLeft?.caption}
					width={500}
					height={360}
					src={getUrlByMinFormat(page.mainImageLeft, 'small')}
					alt={page.mainImageLeft?.alternativeText}
					style={isTablet ? { height: 'auto' } : {}}
				></Image>
				<Box sx={{ marginLeft: { xs: 0, md: '2.5em' }, marginTop: { xs: '1em', md: 0 } }}>
					{renderH1({ display: { xs: 'none', md: 'block' }, typography: 'h3' })}
					<Typography>
						<ReactMarkdown content={page.mainTextRight}></ReactMarkdown>
					</Typography>
				</Box>
			</Box>
			<BlockImages
				withoutOverlay={isTablet}
				sx={{ marginY: '0', paddingY: 0 }}
				images={page.images1}
			></BlockImages>
			<Typography marginTop='1em' textTransform='uppercase' withSeparator component='h2' variant='h4'>
				{page.deliveryCitiesTitle}
			</Typography>
			<Table sx={{ marginY: '2em', maxWidth: 930 }}>
				<TableBody>
					{page.deliveryCitiesDescription.map((item) => (
						<TableRow key={item.value}>
							<TableCell sx={{ width: { xs: 'initial', md: '600px' } }}>
								<Typography>{item.label}</Typography>
							</TableCell>
							<TableCell>
								<Typography fontWeight='500'>{item.value}</Typography>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Box>
				<Typography marginTop='1em' textTransform='uppercase' withSeparator component='h2' variant='h4'>
					{page.courierTitle}
				</Typography>
				<Table sx={{ marginY: '2em', maxWidth: 1030 }}>
					<TableBody>
						{page.courierDescription.map((item) => (
							<TableRow key={item.value}>
								<TableCell sx={{ width: { xs: 'initial', md: '600px' } }}>
									<Typography>{item.label}</Typography>
								</TableCell>
								<TableCell>
									<Typography fontWeight='500'>{item.value}</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Box>
			<Typography marginTop='1em' withSeparator component='h2' variant='h4' textTransform='uppercase'>
				{page.shipmentTitle}
			</Typography>
			<Box
				display='flex'
				paddingTop='2em'
				sx={{
					flexDirection: { xs: 'column', md: 'row' },
					alignItems: { xs: 'initial', md: 'center' },
					marginBottom: { xs: '1em', md: '' }
				}}
			>
				<Box
					sx={{
						paddingRight: { xs: 0, md: '3em' },
						maxWidth: { xs: '100%', md: 'calc(100% - 300px)' },
						marginBottom: { xs: '1em', md: 0 }
					}}
				>
					<ReactMarkdown content={page.shipmentText}></ReactMarkdown>
				</Box>
				<Box>
					<Image
						title={page.shipmentImageRight?.caption}
						width={300}
						height={210}
						src={getUrlByMinFormat(page.shipmentImageRight, 'small')}
						alt={page.shipmentImageRight?.alternativeText}
					></Image>
				</Box>
			</Box>
			<BlockImages
				withoutOverlay={isTablet}
				images={page.images2}
				sx={{
					marginBottom: '-2em',
					flexDirection: { xs: 'column', md: 'row' },
					marginTop: { xs: 0, md: '3em' }
				}}
			></BlockImages>
		</>
	);
};

export default Delivery;

export const getStaticProps = getPageProps(
	fetchPage('delivery', {
		populate: [
			'seo',
			'images1',
			'images2',
			'mainImageLeft',
			'deliveryCitiesDescription',
			'courierDescription',
			'shipmentImageRight'
		]
	})
);
