import { Typography, Grid, ListItemButton, Box, useMediaQuery } from '@mui/material';
import { Container } from '@mui/system';
import styles from './Footer.module.scss';
import { Footer as IFooter } from 'api/layout/types';
import { FC } from 'react';
import ReactMarkdown from 'components/ReactMarkdown';
import Image from 'components/Image';
import { TwitterShareButton } from 'react-share';
import TwitterIcon from 'react-share/lib/TwitterIcon';
import FacebookShareButton from 'react-share/lib/FacebookShareButton';
import FacebookIcon from 'react-share/lib/FacebookIcon';
import VKShareButton from 'react-share/lib/VKShareButton';
import VKIcon from 'react-share/lib/VKIcon';
import PinterestIcon from 'react-share/lib/PinterestIcon';
import PinterestShareButton from 'react-share/lib/PinterestShareButton';
import OKShareButton from 'react-share/lib/OKShareButton';
import OKIcon from 'react-share/lib/OKIcon';
import LivejournalShareButton from 'react-share/lib/LivejournalShareButton';
import LivejournalIcon from 'react-share/lib/LivejournalIcon';

interface Props {
    footer: IFooter;
}

const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

const Footer: FC<Props> = ({ footer }) => {
    const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
    const description =
        typeof window !== 'undefined' ? (document.querySelector('[name=description]') as HTMLMetaElement)?.content : '';
    const title = typeof window !== 'undefined' ? document.title : '';
    return (
        <Box
            component="footer"
            bgcolor="secondary.main"
            sx={{ padding: { xs: '20px 0 40px', md: '20px 0' } }}
            className={styles.footer}>
            <Container>
                <Box
                    display="flex"
                    sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' }, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Box
                        className={styles.footer__item}
                        sx={{
                            order: { xs: 4, sm: 1 },
                            width: { md: '25%', xs: '100%' },
                            paddingX: { xs: 0, md: '1.5em' }
                        }}>
                        <ReactMarkdown content={footer.firstBlock}></ReactMarkdown>
                    </Box>

                    <Box
                        display="flex"
                        flexWrap="wrap"
                        className={styles.footer__item}
                        sx={{ order: { xs: 2 }, width: { md: '25%', xs: '100%' }, padding: { xs: 0, md: '0 1em' } }}>
                        <Typography
                            gutterBottom
                            display={{ xs: 'block', md: 'none' }}
                            width={'100%'}
                            textTransform="uppercase">
                            Мы в соц сетях:
                        </Typography>
                        {footer.socials?.map((item) => (
                            <ListItemButton
                                sx={{ padding: '0.5em 0.25em', width: { xs: 'auto', md: '50%' }, flex: 'initial' }}
                                component="a"
                                key={item.id}
                                href={item.link}
                                target="_blank"
                                color="inherit">
                                <Image
                                    title={item.image?.caption}
                                    alt={item.image?.alternativeText}
                                    width={20}
                                    height={20}
                                    src={item.image?.url}></Image>
                                <Typography marginLeft="0.5em">{item.image?.caption}</Typography>
                            </ListItemButton>
                        ))}
                    </Box>

                    <Box
                        className={(styles.footer__item, styles.footer__item_map)}
                        sx={{ order: { xs: 3 }, width: { md: '25%', xs: '100%' }, paddingX: { xs: 0, md: '1em' } }}>
                        <iframe
                            style={{ maxWidth: '100%' }}
                            src="https://yandex.ru/map-widget/v1/?um=constructor%3Aa553e2f9544eb2f0c9143e3fc50b1dd10fc059188ae131165b0455a4ff8c645b&amp;source=constructor"
                            frameBorder="0"></iframe>
                    </Box>

                    <Box
                        className={styles.footer__item}
                        sx={{
                            order: { xs: 1, md: 4 },
                            width: { md: '25%', xs: '100%' },
                            padding: { xs: 0, md: '0 1.5em 0 3em' }
                        }}>
                        <ReactMarkdown content={footer.fourthBlock}></ReactMarkdown>
                        <Box>
                            <Typography>Поделиться:</Typography>
                            <TwitterShareButton
                                className={styles.share}
                                url="http://twitter.com/share"
                                title={title}
                                via={'https://twitter.com/MZapcastej'}>
                                <TwitterIcon size={25}></TwitterIcon>
                            </TwitterShareButton>
                            <FacebookShareButton
                                className={styles.share}
                                url={'http://www.facebook.com/sharer.php'}
                                quote={title}>
                                <FacebookIcon size={25}></FacebookIcon>
                            </FacebookShareButton>
                            <VKShareButton className={styles.share} title={title} url="http://vk.com/share.php">
                                <VKIcon size={25}></VKIcon>
                            </VKShareButton>
                            <PinterestShareButton
                                className={styles.share}
                                description={description}
                                media={origin + '/logo.jpg'}
                                url="http://www.pinterest.com/pin/create/button">
                                <PinterestIcon size={25}></PinterestIcon>
                            </PinterestShareButton>
                            <OKShareButton
                                className={styles.share}
                                url={'https://connect.ok.ru/dk'}
                                title={title}
                                description={description}
                                image={origin + '/logo.jpg'}>
                                <OKIcon size={25}></OKIcon>
                            </OKShareButton>
                            <LivejournalShareButton
                                className={styles.share}
                                url="http://www.livejournal.com/update.bml"
                                title={title}
                                description={description}>
                                <LivejournalIcon size={25}></LivejournalIcon>
                            </LivejournalShareButton>
                        </Box>
                    </Box>
                </Box>
                <Box overflow={{ xs: 'auto', md: 'initial' }}>
                    <Image
                        title="Bepaid карточки"
                        alt="Bepaid карточки"
                        isOnSSR={false}
                        src="/be_paid_cards.png"
                        width={1452}
                        style={isTablet ? { maxWidth: 'initial' } : {}}
                        height={100}></Image>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
