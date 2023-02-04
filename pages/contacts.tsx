import WhiteBox from 'components/WhiteBox';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import Typography from 'components/Typography';
import { Box } from '@mui/system';
import Image from 'components/Image';
import { Button, Input, Link, TextareaAutosize, TextField } from '@mui/material';
import { ChangeEventHandler, FormEvent, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useThrottle } from 'rooks';
import { send } from 'api/email';
import { useSnackbar } from 'notistack';

interface Props {
    page: DefaultPage & { content: string };
}

const Contacts = ({ page }: Props) => {
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [message, setMessage] = useState<string>('');

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
                Авторазборка Полотково ООО “Дриблинг”
            </Typography>
            <Box display="flex" gap="1em" marginBottom="2em">
                <Box flex="1" display="flex" padding="2em 1em" alignItems="center" bgcolor="#fff">
                    <Image src="/phone.png" width={50} isOnSSR={false} height={50} alt="phone 1"></Image>
                    <Link marginLeft="1em" color="#000" underline="hover" href="tel:+375297804780">
                        +375 29 780 4 780
                    </Link>
                </Box>
                <Box flex="1" display="flex" padding="2em 1em" bgcolor="#fff" alignItems="center">
                    <Image width={50} height={50} isOnSSR={false} src="/phone.png" alt="phone 1"></Image>
                    <Link marginLeft="1em" color="#000" underline="hover" href="tel:+375297804780">
                        +375 29 780 4 780
                    </Link>
                </Box>
                <Box flex="1" display="flex" padding="2em 1em" bgcolor="#fff" alignItems="center">
                    <Image width={50} height={50} isOnSSR={false} src="/mark.png" alt="phone 1"></Image>
                    <Typography marginLeft="1em">д полотково, Гродно 231710</Typography>
                </Box>
            </Box>
            <Box display="flex" marginBottom="5em">
                <iframe
                    style={{ flex: '1' }}
                    height={500}
                    src="https://yandex.ru/map-widget/v1/?um=constructor%3Aa553e2f9544eb2f0c9143e3fc50b1dd10fc059188ae131165b0455a4ff8c645b&amp;source=constructor"
                    frameBorder="0"></iframe>
                <Box flex="1" marginLeft="2em">
                    <Typography
                        component="h2"
                        fontWeight="500"
                        marginBottom="1em"
                        variant="h5"
                        textTransform="uppercase">
                        Задайте свой вопрос
                    </Typography>
                    <Typography color="text.secondary" marginBottom="1em">
                        До сих пор сомневаетесь в необходимости приобретения новых запчастей для своего “железного
                        друга”? Отбросьте все сомнения и смело обращайтесь к команде профессионалов проекта “Дриблинг
                        Авто” в Гродно. Если не можете определиться, то вам обязательно помогут в этом вопросе. Не
                        знаете, что точно подойдет или не подойдет? Не беспокойтесь, ведь все запчасти выдаются с
                        соответствующей документацией (факты наличия, продажи, проверки, приема) и поэтому обменять их
                        не составит труда.
                    </Typography>
                    <Box component="form" onSubmit={throttledSubmit} maxWidth="430px">
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
                        <Button variant="contained" sx={{ padding: '0.5em 5em' }} type="submit">
                            Отправить
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box>
                <Typography marginBottom="1em">
                    Компания “Дриблинг Авто” в Гродно, расположившаяся буквально в 4 км от города, — надежный помощник в
                    подборе и приобретении б/у комплектующих для вашего автомобиля. Неважно то, для каких целей вам
                    нужны вторичные запчасти, в каком объеме и при каких условиях — все эти вопросы решит наша фирма.
                    Выкупом, разборкой и продажами автомобилей как в целом виде, так по частям, фирма занимается с 2009
                    года, поэтому опыта у нас не занимать!
                </Typography>
                <Typography marginBottom="1em">
                    Отвечая за качество и совершенствуя технологические процессы, мы стремимся с каждым днем становится
                    все лучше и лучше. Нет тех целей, которые наша компания бы не достигла, ведь настоящее богатство —
                    люди, работающие в грамотно отлаженной системе нашего интернет-магазина. “Дриблинг Авто” в Гродно
                    помогает решить насущные вопросы, которые часто встают перед каждым автолюбителем, в частности, мы
                    занимаемся тем, чтобы приобрести деталь аналогичного качества за меньшие деньги.
                </Typography>
                <Typography marginBottom="1em">
                    Бытует мнение, что на вторичке ничего хорошего не найти, но наши специалисты так не думают. Команда
                    профессионалов, во-первых, грамотно проведет консультацию с клиентом, а во-вторых, даст развернутый
                    фидбек по сложившейся ситуации, плюсом предложить лояльные цены и открытые товарные позиции. В
                    наличии можно найти абсолютно разные комплектующие: двигатели, коробки, элементы подвески и кузова,
                    оптику, колеса и прочее. Одно из приоритетных направлений в развитии заключается в ежемесячном
                    расширении ассортимента, что позволяет привлечь значительно больше драгоценных клиентов.
                </Typography>
                <Typography marginBottom="1em">
                    И если другие фирмы будут заламывать бешеные ценники, то мы предоставляем покупателям открытую
                    политику ценообразования. За каждый пункт несется отчет, поэтому никаких “левых схем”, а всегда
                    чистая известно из чего сложившаяся стоимость товара. Конечно, вы можете обратиться к официальным
                    дилерам за сломанной деталью в машине, но можете и хорошо сэкономить, получив товар с аналогичным
                    качеством в компании “Дриблинг Авто” в Гродно.
                </Typography>
                <Typography marginBottom="1em">
                    Дриблинг это запчасти для авто различных марок Если автомобиль не подлежит ремонту, просто бросить
                    его не получится — в Беларуси машину нужно утилизировать, предварительно подготовив (снять колеса,
                    стекла, потратиться на доставку). Проще и выгоднее заработать на продаже б/у запчастей от
                    автомобиля. Компания занимается выкупом любых машин: битых, неремонтопригодных, любого года выпуска.
                    Запчасти для авто в наличии на складе Покупая комплектующие «с рук», нельзя исключать того, что они
                    были сняты с нелегальной машины. В авторазборке все запчасти оригинальные, вы получаете гарантию, а
                    также документы на предлагаемую деталь. Часть запчастей снимается с автомобилей, приобретенных на
                    территории Беларуси, отдельные машинокомплекты приобретаются за рубежом. Всегда в наличии:
                </Typography>
                <Box component="ul">
                    <Typography component="li">двигатели,</Typography>
                    <Typography component="li">МКПП и АКПП,</Typography>
                    <Typography component="li">элементы подвески,</Typography>
                    <Typography component="li">кузовные элементы,</Typography>
                    <Typography component="li">оптика</Typography>
                    <Typography component="li">элементы салона,</Typography>
                </Box>
            </Box>
        </>
    );
};

export default Contacts;

export const getStaticProps = getPageProps(fetchPage('contact'), () => ({ hideSEOBox: true }));
