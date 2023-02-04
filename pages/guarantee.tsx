import { Box } from '@mui/material';
import { Container } from '@mui/system';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import BlockImages from 'components/BlockImages';
import Image from 'components/Image';
import Typography from 'components/Typography';
import { getPageProps } from 'services/PagePropsService';

interface Props {
    page: DefaultPage & { content: string };
}

const Guarantee = ({ page }: Props) => {
    return (
        <>
            <Container>
                <Box display="flex">
                    <Image src={'/guarantee_img.png'} isOnSSR={false} width={500} height={360} alt="Guarantee"></Image>
                    <Box marginLeft="3em">
                        <Typography variant="h4" component="h1" marginBottom="0.5em" fontWeight="500">
                            Гарантия на б/у запчасти
                        </Typography>
                        Гарантия на б/у запчасти, приобретенные на авторазборке Полотково в Гродно, составляет 14
                        календарных дней. Гарантия распространяется на:
                        <Typography component="ul">
                            <Typography component="li">двигатель</Typography>
                            <Typography component="li">навесное оборудование электронные механизмы</Typography>
                            <Typography component="li">электронные блоки</Typography>
                            <Typography component="li">МКПП/АКПП</Typography>
                            <Typography component="li">колёсные диски</Typography>
                        </Typography>
                    </Box>
                </Box>
            </Container>
            <BlockImages imageSRCs={['/guarantee_img.png', '/guarantee_img.png', '/guarantee_img.png']}></BlockImages>
            <Container>
                <Typography withSeparator variant="h4" textTransform="uppercase" fontWeight="500" marginBottom="0.5em">
                    Гарантия не распространяется на:
                </Typography>
                <Typography>
                    детали подвески, радиаторы, оптику, стекла, кузовные детали, колеса, шины, зеркала, фары, фонари,
                    проводку, пластиковые детали салона, различного рода обшивки, на прокладки, сальники, ремни ГРМ,
                    ролики, а так же любые резиновые детали, входящие в состав агрегата, салона и прочие детали. товары,
                    проданные с дефектами, о которых покупатель был предупрежден перед покупкой. Возврат и обмен
                    Стандартный срок возврата запчастей составляет 14 календарных дней со дня покупки. товара. На
                    протяжении гарантийного срока товар подлежит бесплатному обмену на аналогичный или может быть
                    осуществлен возврат стоимости Специальные отметки При приобретении сложных б/у запчастей, таких,
                    как: коробки передач, коробки раздаточные, редукторы, детали двигателей, детали навесного
                    оборудования двигателей, электронные блоки - специалисты нашей организации наносят специальные
                    отметки краской. При установке деталей на автомобиль, запрещается смывать, уничтожать, снимать или
                    частично повреждать эти отметки.
                </Typography>
            </Container>
            <BlockImages
                imageSRCs={['/guarantee_img.png', '/guarantee_img.png', '/guarantee_img.png']}
                sx={{ bgcolor: 'transparent', padding: 0, marginY: '2em' }}></BlockImages>
            <Container>
                <Box marginBottom="4em" bgcolor="#FFF5DD" padding="2em 4em">
                    <Typography variant="h5" textTransform="uppercase" fontWeight="500">
                        Возврат запчастей осуществляется при выполнении следующих условий
                    </Typography>
                    <Box display="flex">
                        <Box marginTop="2em" maxWidth="250px" width="100%">
                            <Image isOnSSR={false} src="/warning.png" width={190} height={190} alt="Warning"></Image>
                        </Box>
                        <Box component="ul" textTransform="uppercase">
                            <Typography variant="h6" fontWeight="normal" component="li" marginY="0.5em">
                                сохранение внешнего вида
                            </Typography>
                            <Typography variant="h6" fontWeight="normal" component="li" marginY="0.5em">
                                сохранение защитных пломб
                            </Typography>
                            <Typography variant="h6" fontWeight="normal" component="li" marginY="0.5em">
                                сохранение маркировки
                            </Typography>
                            <Typography variant="h6" fontWeight="normal" component="li" marginY="0.5em">
                                комплектность
                            </Typography>
                            <Typography variant="h6" fontWeight="normal" component="li" marginY="0.5em">
                                имеются доказательства приобретения на гродненской авторазборке Полотково Товар возврату
                                не подлежит в случае: истечения гарантийного срока
                            </Typography>
                            <Typography variant="h6" fontWeight="normal" component="li" marginY="0.5em">
                                отсутствия (повреждении) меток продавца
                            </Typography>
                            <Typography variant="h6" fontWeight="normal" component="li" marginY="0.5em">
                                отсутствия или утери чека
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Typography marginBottom="1em">
                    В случае возврата приобретённых б/у запчастей, затраты клиента, связанные с его установкой и
                    транспортировкой, авторазборка Полотково в Гродно не компенсирует.
                </Typography>
                <Typography variant="h6" textTransform="uppercase" fontWeight="normal">
                    C уважением, магазин б/у запчастей для автомобиля.
                </Typography>
            </Container>
        </>
    );
};

export default Guarantee;

export const getStaticProps = getPageProps(fetchPage('guarantee'), () => ({
    hasGlobalContainer: false,
    hideSEOBox: true
}));
