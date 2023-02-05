import WhiteBox from 'components/WhiteBox';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import Typography from 'components/Typography';
import CarouselReviews from 'components/CarouselReviews';
import { fetchReviews } from 'api/reviews/reviews';
import { Review } from 'api/reviews/types';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useMediaQuery } from '@mui/material';
import { Image } from 'api/types';

interface Props {
    page: DefaultPage & { content: string; blockImages1: Image[]; blockImages2: Image[] };
}

const About = ({ page }: Props) => {
    return (
        <>
            <ReactMarkdown
                content={page.content}
                blockImagesSnippets={{
                    blockImages1: page.blockImages1,
                    blockImages2: page.blockImages2
                }}></ReactMarkdown>
        </>
    );
};

export default About;

export const getStaticProps = getPageProps(fetchPage('about', { populate: ['blockImages1', 'blockImages2'] }));
