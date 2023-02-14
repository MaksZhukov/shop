import { FC } from 'react';

import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { PageDelivery } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import Image from 'components/Image';
import { Box, Container } from '@mui/system';
import Typography from 'components/Typography';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import BlockImages from 'components/BlockImages';

interface Props {
    page: PageDelivery;
}

const Delivery: FC<Props> = ({ page }) => {
    return (
        <>
            <Box marginBottom="4em" display="flex">
                <Image
                    title={page.mainImageLeft?.caption}
                    width={page.mainImageLeft?.width}
                    height={page.mainImageLeft?.height}
                    src={page.mainImageLeft?.url}
                    alt={page.mainImageLeft?.alternativeText}></Image>
                <Box marginLeft="2.5em">
                    <Typography variant="h3" fontWeight="500" marginBottom="1em" component="h1">
                        {page.h1}
                    </Typography>
                    <Typography>
                        <ReactMarkdown content={page.mainTextRight}></ReactMarkdown>
                    </Typography>
                </Box>
            </Box>
            <BlockImages images={page.images1}></BlockImages>
            <Typography marginTop="1em" textTransform="uppercase" withSeparator component="h2" variant="h4">
                {page.deliveryCitiesTitle}
            </Typography>
            <Table sx={{ marginY: '2em', maxWidth: 930 }}>
                <TableBody>
                    {page.deliveryCitiesDescription.map((item) => (
                        <TableRow key={item.value}>
                            <TableCell width={600}>
                                <Typography whiteSpace="nowrap">{item.label}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight="500">{item.value}</Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Box>
                <Typography marginTop="1em" textTransform="uppercase" withSeparator component="h2" variant="h4">
                    {page.courierTitle}
                </Typography>
                <Table sx={{ marginY: '2em', maxWidth: 1030 }}>
                    <TableBody>
                        {page.courierDescription.map((item) => (
                            <TableRow key={item.value}>
                                <TableCell width={600}>
                                    <Typography whiteSpace="nowrap">{item.label}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontWeight="500">{item.value}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
            <Typography marginTop="1em" withSeparator component="h2" variant="h4" textTransform="uppercase">
                {page.shipmentTitle}
            </Typography>
            <Box marginBottom="4em" display="flex" paddingTop="2em" alignItems="center">
                <Box paddingRight="3em">
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
            <BlockImages images={page.images2} sx={{ marginBottom: '-3em' }}></BlockImages>
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
