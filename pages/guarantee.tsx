import { Box } from '@mui/material';
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
    return (
        <>
            <Box display="flex">
                <Image
                    title={page.mainLeftImage?.caption}
                    src={page.mainLeftImage?.url}
                    width={page.mainLeftImage?.width}
                    height={page.mainLeftImage?.height}
                    alt={page.mainLeftImage?.alternativeText}></Image>
                <Box marginLeft="3em">
                    <Typography variant="h4" component="h1" marginBottom="0.5em" fontWeight="500">
                        {page.h1}
                    </Typography>
                    <ReactMarkdown content={page.mainRightText}></ReactMarkdown>
                </Box>
            </Box>
            <BlockImages images={page.images1}></BlockImages>
            <Typography withSeparator variant="h4" textTransform="uppercase" fontWeight="500" marginBottom="0.5em">
                {page.guaranteeNotApplyTitle}
            </Typography>
            <Typography>
                <ReactMarkdown content={page.guaranteeNotApplyText}></ReactMarkdown>
            </Typography>
            <BlockImages withoutOverlay images={page.images1} sx={{ padding: 0, marginY: '2em' }}></BlockImages>
            <Box marginBottom="4em" bgcolor="#FFF5DD" padding="2em 4em">
                <Typography variant="h5" textTransform="uppercase" fontWeight="500">
                    {page.warningTitle}
                </Typography>
                <Box display="flex">
                    <Box marginTop="2em" maxWidth="250px" width="100%">
                        <Image
                            title={page.warningLeftImage?.caption}
                            src={page.warningLeftImage?.url}
                            width={page.warningLeftImage?.width}
                            height={page.warningLeftImage?.height}
                            alt={page.warningLeftImage?.alternativeText}></Image>
                    </Box>
                    <Box component="ul" textTransform="uppercase">
                        {page.warningRightText.split('\n').map((item) => (
                            <Typography key={item} variant="h6" fontWeight="normal" component="li" marginY="0.5em">
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
