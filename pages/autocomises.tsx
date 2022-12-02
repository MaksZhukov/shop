import { Box, Link, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { ApiResponse, MetaResponse } from 'api/types';
import HeadSEO from 'components/HeadSEO';
import Image from 'components/Image';
import SEOBox from 'components/SEOBox';
import WhiteBox from 'components/WhiteBox';
import { NextPage } from 'next';
import getConfig from 'next/config';
import { getPageProps } from 'services/PagePropsService';
import NextLink from 'next/link';
import { fetchAutocomises } from 'api/autocomises/autocomises';
import { Autocomis } from 'api/autocomises/types';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import Card from 'components/Card';

const { publicRuntimeConfig } = getConfig();

interface Props {
    page: DefaultPage;
    autocomises: ApiResponse<Autocomis[]>;
}

const Vacancies: NextPage<Props> = ({ page, autocomises }) => {
    return (
        <Container>
            <HeadSEO
                title={page.seo?.title}
                description={page.seo?.description}
                keywords={page.seo?.keywords}
            ></HeadSEO>

            <WhiteBox>
                <Typography textAlign="center" component="h1" variant="h4" marginBottom="1em">
                    {page.seo?.h1 || 'Автокомисы'}
                </Typography>
                {autocomises.data.map((item) => (
                    <Card
                        key={item.id}
                        description={item.description}
                        name={item.name}
                        image={item.image}
                        link={`/autocomises/${item.slug}`}
                    ></Card>
                ))}
            </WhiteBox>
            <SEOBox images={page.seo?.images} content={page.seo?.content}></SEOBox>
        </Container>
    );
};

export default Vacancies;

export const getStaticProps = getPageProps(fetchPage('autocomis'), async () => ({
    autocomises: (
        await fetchAutocomises(
            {
                populate: 'image',
            },
            true
        )
    ).data,
}));
