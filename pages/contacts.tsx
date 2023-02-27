import WhiteBox from 'components/WhiteBox';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageContacts } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import Typography from 'components/Typography';
import { Box } from '@mui/system';
import Image from 'components/Image';
import { Button, Input, Link, TextareaAutosize, TextField, useMediaQuery } from '@mui/material';
import { ChangeEventHandler, FormEvent, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useThrottle } from 'rooks';
import { send } from 'api/email';
import { useSnackbar } from 'notistack';
import BlockImages from 'components/BlockImages';

interface Props {
    page: PageContacts;
}

const Contacts = ({ page }: Props) => {
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

    const { enqueueSnackbar } = useSnackbar();

    const handleChangeName: ChangeEventHandler<HTMLInputElement> = (e) => {
        setName(e.target.name);
    };
    const handleChangePhone: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPhone(e.target.value);
    };
    const handleChangeMessage: ChangeEventHandler<HTMLInputElement> = (e) => {
        setMessage(e.target.value);
    };
    const [throttledSubmit] = useThrottle(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await send(
                'Вопрос',
                `<b>Телефон</b>: ${phone} <br /><b>Имя</b>: ${name} <br /><b>Сообщение</b>: ${message} <br />`
            );
            enqueueSnackbar('Ваш вопрос успешно отправлен', {
                variant: 'success'
            });
            setName('');
            setPhone('');
            setMessage('');
            setPhone('');
        } catch (err) {
            enqueueSnackbar('Произошла какая-то ошибка при отправке, обратитесь в поддержку', {
                variant: 'error'
            });
        }
    }, 300);
    return (
        <>
            <Typography component="h1" marginBottom="1.5em" variant="h4" textTransform="uppercase">
                {page.h1}
            </Typography>
            <Box display="flex" gap="1em" marginBottom="2em" sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box flex="1" display="flex" padding="2em 1em" alignItems="center" bgcolor="#fff">
                    <Image
                        title={'Телефон 1'}
                        src="/phone.png"
                        width={50}
                        isOnSSR={false}
                        height={50}
                        alt="Телефон 1"></Image>
                    <Link
                        marginLeft="1em"
                        color="#000"
                        underline="hover"
                        href={`tel:${page.phone1.replaceAll(' ', '')}`}>
                        {page.phone1}
                    </Link>
                </Box>
                <Box flex="1" display="flex" padding="2em 1em" bgcolor="#fff" alignItems="center">
                    <Image
                        title="Телефон 2"
                        width={50}
                        height={50}
                        isOnSSR={false}
                        src="/phone.png"
                        alt="Телефон 2"></Image>
                    <Link
                        marginLeft="1em"
                        color="#000"
                        underline="hover"
                        href={`tel:${page.phone2.replaceAll(' ', '')}`}>
                        {page.phone2}
                    </Link>
                </Box>
                <Box flex="1" display="flex" padding="2em 1em" bgcolor="#fff" alignItems="center">
                    <Image
                        title="Расположение "
                        width={50}
                        height={50}
                        isOnSSR={false}
                        src="/mark.png"
                        alt="Расположение"></Image>
                    <Typography marginLeft="1em">д полотково, Гродно 231710</Typography>
                </Box>
            </Box>
            <Box
                display="flex"
                sx={{ flexDirection: { xs: 'column-reverse', md: 'row' }, marginBottom: { xs: '1em', md: '5em' } }}>
                <iframe
                    style={{ flex: '1', minHeight: isMobile ? 400 : 500 }}
                    src="https://yandex.ru/map-widget/v1/?um=constructor%3Aa553e2f9544eb2f0c9143e3fc50b1dd10fc059188ae131165b0455a4ff8c645b&amp;source=constructor"
                    frameBorder="0"></iframe>
                <Box flex="1" sx={{ marginBottom: { xs: '3em', md: '0' }, marginLeft: { xs: 0, md: '2em' } }}>
                    <Typography
                        component="h2"
                        fontWeight="500"
                        marginBottom="1em"
                        variant="h5"
                        textTransform="uppercase">
                        {page.askTitle}
                    </Typography>
                    <Typography color="text.secondary" marginBottom="1em">
                        <ReactMarkdown content={page.askText}></ReactMarkdown>
                    </Typography>
                    <Box component="form" onSubmit={throttledSubmit} sx={{ maxWidth: { xs: 'initial', md: '430px' } }}>
                        <Box marginBottom="1em">
                            <Input
                                sx={{ background: '#fff', padding: '0.5em 1em', border: 'none' }}
                                required
                                onChange={handleChangeName}
                                placeholder="Ваше имя"
                                fullWidth></Input>
                        </Box>
                        <Box marginBottom="1em">
                            <ReactInputMask
                                required
                                mask="+375 99 999 99 99"
                                value={phone}
                                maskChar=" "
                                onChange={handleChangePhone}>
                                {
                                    //@ts-ignore
                                    () => (
                                        <Input
                                            sx={{ background: '#fff', padding: '0.5em 1em' }}
                                            required
                                            placeholder="Ваш телефон"
                                            fullWidth></Input>
                                    )
                                }
                            </ReactInputMask>
                        </Box>
                        <Box marginBottom="1em">
                            <Input
                                required
                                sx={{ background: '#fff', padding: '0.5em 1em' }}
                                onChange={handleChangeMessage}
                                placeholder="Интересуемый вопрос"
                                multiline
                                fullWidth
                                rows={4}></Input>
                        </Box>
                        <Button fullWidth={isMobile} variant="contained" sx={{ padding: '0.5em 5em' }} type="submit">
                            Отправить
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box>
                <ReactMarkdown content={page.content}></ReactMarkdown>
            </Box>
            <Typography component="h2" variant="h5" textTransform="uppercase" marginBottom="1em">
                {page.requisitesTitle}
            </Typography>
            <BlockImages withSlider={isMobile} images={page.requisites}></BlockImages>
            <BlockImages sx={{ marginBottom: '-2em' }} images={page.images}></BlockImages>
        </>
    );
};

export default Contacts;

export const getStaticProps = getPageProps(fetchPage('contact', { populate: ['seo', 'images'] }));
