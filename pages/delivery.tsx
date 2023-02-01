import { FC } from 'react';

import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import Image from 'components/Image';
import { Box, Container } from '@mui/system';
import Typography from 'components/Typography';

interface Props {
    page: DefaultPage & { content: string };
}

const Delivery: FC<Props> = ({ page }) => {
    return (
        <>
            <Container>
                <Box display="flex">
                    <Image width={500} height={360} src="/delivery_img.png" isOnSSR={false} alt={'Delivery'}></Image>
                    <Box>
                        <Typography variant="h3" fontWeight="500" marginBottom="1em" component="h1">
                            Доставка запчастей бу
                        </Typography>
                        <Typography>
                            Если Вы видите знак на карточке товара [ *Бесплатная доставка ] – данный товар может быть
                            доставлен в ближайшее отделение ОПС ЕвроПочты за сумму указанную в карточке товара, без
                            оплаты стоимости доставки! Для заказа используйте кнопку “Быстрый заказ”.
                        </Typography>
                    </Box>
                </Box>
            </Container>
            <Box bgcolor="#fff">
                <Container>
                    <Box display="flex">
                        <Box>
                            <Image
                                width={500}
                                height={360}
                                src="/delivery_img.png"
                                isOnSSR={false}
                                alt={'Delivery'}></Image>
                        </Box>
                        <Box>
                            <Image
                                width={500}
                                height={360}
                                src="/delivery_img.png"
                                isOnSSR={false}
                                alt={'Delivery'}></Image>
                        </Box>
                        <Box>
                            {' '}
                            <Image
                                width={500}
                                height={360}
                                src="/delivery_img.png"
                                isOnSSR={false}
                                alt={'Delivery'}></Image>
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Box>
                <Typography withSeparator>Доставка в другие города (по Беларуси)</Typography>
            </Box>
        </>
    );
};

export default Delivery;

export const getStaticProps = getPageProps(fetchPage('delivery'), () => ({ hasGlobalContainer: false }));
