import { FC } from 'react';

import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { PageDelivery } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import Image from 'components/Image';
import { Box, Container } from '@mui/system';
import Typography from 'components/Typography';
import { Table, TableBody, TableCell, TableRow, SxProps, useMediaQuery } from '@mui/material';
import BlockImages from 'components/BlockImages';

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
                sx={{ marginBottom: { xs: '1em', md: '4em' }, flexDirection: { xs: 'column', md: 'row' } }}>
                {renderH1({ display: { xs: 'block', md: 'none' }, typography: 'h4', marginBottom: '1em' })}
                <Image
                    title={page.mainImageLeft?.caption}
                    width={500}
                    height={360}
                    src={page.mainImageLeft?.formats?.small.url || page.mainImageLeft?.url}
                    alt={page.mainImageLeft?.alternativeText}
                    style={isTablet ? { height: 'auto' } : {}}></Image>
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
                images={page.images1}></BlockImages>
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
                    marginBottom: { xs: '1em', md: '4em' }
                }}>
                <Box sx={{ paddingRight: { xs: 0, md: '3em' }, marginBottom: { xs: '1em', md: 0 } }}>
                    <ReactMarkdown content={page.shipmentText}></ReactMarkdown>
                </Box>
                <Box>
                    <Image
                        title={page.shipmentImageRight?.caption}
                        width={page.shipmentImageRight?.width}
                        height={page.shipmentImageRight?.height}
                        src={page.shipmentImageRight?.url}
                        alt={page.shipmentImageRight?.alternativeText}></Image>
                </Box>
            </Box>
            <BlockImages
                withoutOverlay={isTablet}
                images={page.images2}
                sx={{
                    marginBottom: '-2em',
                    flexDirection: { xs: 'column', md: 'row' },
                    marginTop: { xs: 0, md: '3em' }
                }}></BlockImages>
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
