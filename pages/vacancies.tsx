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
import { fetchVacancies } from 'api/vacancies/vacancies';
import { Vacancy } from 'api/vacancies/types';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';

const { publicRuntimeConfig } = getConfig();

interface Props {
    page: DefaultPage;
    vacancies: ApiResponse<Vacancy[]>;
}

const Vacancies: NextPage<Props> = ({ page, vacancies }) => {
    return (
        <Container>
            <HeadSEO
                title={page.seo?.title}
                description={page.seo?.description}
                keywords={page.seo?.keywords}
            ></HeadSEO>

            <WhiteBox>
                <Typography textAlign="center" component="h1" variant="h4" marginBottom="1em">
                    {page.seo?.h1}
                </Typography>
                {vacancies.data.map((item) => (
                    <Box display="flex" marginBottom="2em" key={item.id}>
                        <Image
                            alt={item.image.alternativeText}
                            width={208}
                            height={156}
                            src={item.image.formats?.thumbnail.url || item.image.url}
                        ></Image>

                        <Box marginLeft="1em">
                            <Typography component="h2" variant="h5">
                                <NextLink href={`/vacancies/${item.slug}`}>
                                    <Link component="span" underline="hover">
                                        {item.name}
                                    </Link>
                                </NextLink>
                            </Typography>
                            <Typography>
                                {item.description.substring(0, 500)}...{' '}
                                <NextLink href={`/vacancies/${item.slug}`}>
                                    <Link component="span" underline="hover">
                                        читать далее
                                    </Link>
                                </NextLink>
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </WhiteBox>
            <SEOBox images={page.seo?.images} content={page.seo?.content}></SEOBox>
        </Container>
    );
};

export default Vacancies;

export const getStaticProps = getPageProps(fetchPage('vacancy'), async () => ({
    vacancies: (
        await fetchVacancies(
            {
                populate: 'image',
            },
            true
        )
    ).data,
}));
