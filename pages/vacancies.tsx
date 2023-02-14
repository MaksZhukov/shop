import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { PageVacancies, Vacancy } from 'api/pages/types';
import { Box } from '@mui/system';
import Image from 'components/Image';
import Typography from 'components/Typography';
import BlockImages from 'components/BlockImages';

interface Props {
    page: PageVacancies;
}

const Vacancies: NextPage<Props> = ({ page }) => {
    let renderVacancy = (item: Vacancy, index: number) => {
        return (
            <>
                <Box key={item.id} display="flex">
                    <Image title={item.image.caption} src={item.image?.url} alt={item.image.alternativeText} width={500} height={360}></Image>
                    <Box paddingLeft="3em">
                        <Typography
                            marginBottom="1em"
                            component={index === 0 ? 'h1' : 'h2'}
                            variant="h4"
                            textTransform="uppercase"
                            fontWeight="500">
                            {item.title}
                        </Typography>
                        <Typography marginBottom="2em" color="text.secondary" variant="h5" textTransform="uppercase">
                            {item.vacancy}
                        </Typography>
                        <Table>
                            <TableBody>
                                {item.description.map((option) => (
                                    <TableRow key={option.value}>
                                        <TableCell
                                            width={300}
                                            sx={{ border: 'none', padding: '0.5em 0 0.5em 0' }}
                                            padding="none">
                                            <Typography>{option.label}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', padding: '0.5em 0 0.5em 0' }} padding="none">
                                            <Typography fontWeight="500">{option.value}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Box>
                <BlockImages images={item.images}></BlockImages>
                <Typography
                    marginBottom="2em"
                    component="h2"
                    variant="h4"
                    textTransform="uppercase"
                    fontWeight="500"
                    withSeparator>
                    {item.fullTitle}
                </Typography>
                <Box display="flex" marginBottom="4em">
                    <Box flex="1" paddingRight="5em">
                        <Typography color="text.secondary" variant="h6" textTransform="uppercase">
                            Обязаности
                        </Typography>
                        <Box component="ul" padding="0">
                            {item.responsibilities.split('\n').map((val) => (
                                <Typography marginBottom="1em" key={val} component="li">
                                    {val}
                                </Typography>
                            ))}
                        </Box>
                        <Box marginTop="2em" display="flex" justifyContent="center">
                            <Image src="/logo_medium.png" isOnSSR={false} width={315} height={87} alt="Разборка авто вакансия" title='Разборка авто вакансия'></Image>
                        </Box>
                    </Box>
                    <Box flex="1" paddingRight="10em">
                        <Typography color="text.secondary" variant="h6" textTransform="uppercase">
                            Требования
                        </Typography>
                        <Box component="ul" padding="0">
                            {item.requirements.split('\n').map((val) => (
                                <Typography marginBottom="1em" key={val} component="li">
                                    {val}
                                </Typography>
                            ))}
                        </Box>
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
