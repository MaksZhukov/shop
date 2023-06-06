import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageBuybackCars } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import { fetchCarsOnParts } from 'api/cars-on-parts/cars-on-parts';
import { CarOnParts } from 'api/cars-on-parts/types';
import Slider from 'react-slick';
import { Box } from '@mui/system';
import reactStringReplace from 'react-string-replace';
import Image from 'components/Image';
import Typography from 'components/Typography';
import { Button, CircularProgress, Container, Input, TextField, useTheme, Modal, useMediaQuery } from '@mui/material';
import Autocomplete from 'components/Autocomplete';
import { Brand } from 'api/brands/types';
import { ChangeEvent, FormEvent, FormEventHandler, MouseEvent, useRef, useState } from 'react';
import { Model } from 'api/models/types';
import { fetchModels } from 'api/models/models';
import { API_MAX_LIMIT } from 'api/constants';
import { useSnackbar } from 'notistack';
import { YEARS } from '../constants';
import InputMask from 'react-input-mask';
import { send } from 'api/email';
import LoadingButton from '@mui/lab/LoadingButton';
import { useThrottle } from 'rooks';
import classNames from 'classnames';
import styles from './buyback-cars.module.scss';
import { Tune as TuneIcon } from '@mui/icons-material';

interface Props {
    page: PageBuybackCars;
    brands: Brand[];
    cars: CarOnParts[];
}

const BuybackCars = ({ page, cars = [], brands }: Props) => {
    const [brand, setBrand] = useState<{
        label: string;
        value: string;
    } | null>(null);
    const [models, setModels] = useState<Model[]>([]);
    const [model, setModel] = useState<{
        label: string;
        value: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEmailSending, setIsEmailSending] = useState<boolean>(false);
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [year, setYear] = useState<string | null>(null);
    const [phone, setPhone] = useState<string>('');
    const ref = useRef<HTMLFormElement>(null);
    const { breakpoints } = useTheme();
    const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

    const noOptionsText = isLoading ? <CircularProgress size={20} /> : <>Совпадений нет</>;

    const { enqueueSnackbar } = useSnackbar();
    const handleChangeAutocomplete =
        (setValue: (value: any) => void, addFunc?: () => void) =>
        (
            _: any,
            selected:
                | {
                      label: string;
                      value: string;
                  }
                | string
                | null
        ) => {
            setValue(selected);
            if (addFunc) {
                addFunc();
            }
        };

    const handleOpenAutocompleteModels = async () => {
        try {
            setIsLoading(true);
            const {
                data: { data }
            } = await fetchModels({
                filters: { brand: { slug: brand?.value } },
                pagination: { limit: API_MAX_LIMIT }
            });
            setModels(data);
        } catch (err) {
            enqueueSnackbar(
                'Произошла какая-то ошибка при загрузке данных для автозаполнения, обратитесь в поддержку',
                { variant: 'error' }
            );
        }
        setIsLoading(false);
    };

    const handleChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const [throttledSubmit] = useThrottle(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsEmailSending(true);
        try {
            await send(
                'Запрос на выкуп авто',
                `<b>Телефон</b>: ${phone} <br /><b>Марка</b>: ${brand?.label} <br /><b>Модель</b>: ${model?.label} <br /><b>Год</b>: ${year} <br />`
            );
            enqueueSnackbar('Ваша заявка успешно отправлена', {
                variant: 'success'
            });
            setBrand(null);
            setModel(null);
            setYear(null);
            setPhone('');
        } catch (err) {
            enqueueSnackbar('Произошла какая-то ошибка при отправке, обратитесь в поддержку', {
                variant: 'error'
            });
        }
        if (isTablet) {
            setIsModalOpened(false);
        }
        setIsEmailSending(false);
    }, 300);

    const handleClickAssessment = () => {
        if (isTablet) {
            setIsModalOpened(true);
        } else {
            ref.current?.scrollIntoView({});
        }
    };

    const handleClickOpenModal = () => {
        setIsModalOpened(true);
    };

    const handleCloseModal = () => {
        setIsModalOpened(false);
    };

    const renderApplication = (device: 'mobile' | 'desktop') => (
        <Box
            alignSelf='center'
            maxWidth={510}
            display={device === 'desktop' ? { xs: 'none', md: 'block' } : { xs: 'block', md: 'none' }}
            borderRadius='2em'
            padding='1em 2em 3em 2em'
            bgcolor='secondary.main'
            textAlign='center'
            margin={{ xs: 'auto', md: 'initial' }}
            onSubmit={throttledSubmit}
            component='form'
            width={'100%'}>
            <Typography variant='h5' color='#fff' fontWeight='500' marginBottom='1em'>
                Оценить автомобиль
            </Typography>
            <Autocomplete
                disabled={isEmailSending}
                className={styles.autocomplete}
                required
                classes={{ input: styles.autocomplete__input }}
                value={brand}
                placeholder='Выберите марку'
                onChange={handleChangeAutocomplete(setBrand, () => {
                    setModel(null);
                    setModels([]);
                })}
                options={brands.map((item) => ({ label: item.name, value: item.slug }))}></Autocomplete>
            <Autocomplete
                className={styles.autocomplete}
                classes={{ input: styles.autocomplete__input }}
                required
                value={model}
                placeholder='Выберите модель'
                disabled={!brand || isEmailSending}
                noOptionsText={noOptionsText}
                onOpen={handleOpenAutocompleteModels}
                onChange={handleChangeAutocomplete(setModel)}
                options={models.map((item) => ({ label: item.name, value: item.name }))}></Autocomplete>
            <Autocomplete
                disabled={isEmailSending}
                className={styles.autocomplete}
                classes={{ input: styles.autocomplete__input }}
                value={year}
                placeholder='Укажите год выпуска'
                onChange={handleChangeAutocomplete(setYear)}
                options={YEARS.map((item) => item.toString())}></Autocomplete>
            <InputMask
                required
                mask='+375 99 999 99 99'
                value={phone}
                disabled={isEmailSending}
                maskChar=' '
                onChange={handleChangePhone}>
                {
                    //@ts-ignore
                    (inputProps) => {
                        return (
                            <Input
                                {...inputProps}
                                inputRef={(ref) => {
                                    if (ref) {
                                        ref.disabled = isEmailSending;
                                    }
                                }}
                                className={styles.input}
                                sx={{ color: isEmailSending ? 'rgba(0,0,0,0.4)' : 'initial' }}
                                placeholder='Ваш телефон'
                                fullWidth></Input>
                        );
                    }
                }
            </InputMask>
            <LoadingButton
                loading={isEmailSending}
                sx={{
                    padding: '1.25em',
                    borderRadius: 0,
                    fontSize: '16px',
                    ...(isEmailSending ? { bgcolor: '#fdb819' } : {})
                }}
                className={classNames(styles.btn, isEmailSending && styles.btn_loading)}
                fullWidth
                type='submit'
                variant='contained'>
                Оставить заявку
            </LoadingButton>
        </Box>
    );

    return (
        <>
            <Box className={styles.head} marginBottom='2em' minHeight={{ xs: 350, md: 744 }} display='flex'>
                <Image
                    title={page.mainBackgroundImage?.caption}
                    width={page.mainBackgroundImage?.width}
                    height={page.mainBackgroundImage?.height}
                    style={{ position: 'absolute', top: 0, height: '100%', objectFit: 'cover', width: '100%' }}
                    src={page.mainBackgroundImage?.url}
                    alt={page.mainBackgroundImage?.alternativeText}></Image>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: { xs: 0, md: 0 },
                        left: { xs: 0, md: 0 },
                        display: 'flex',
                        alignItems: 'end'
                    }}
                    height={{ xs: 200, md: '100%' }}>
                    <Image
                        title={page.mainBackgroundLeftImage?.caption}
                        width={page.mainBackgroundLeftImage?.width}
                        height={page.mainBackgroundLeftImage?.height}
                        style={{ maxHeight: '100%', width: 'auto' }}
                        src={page.mainBackgroundLeftImage?.url}
                        alt={page.mainBackgroundLeftImage?.alternativeText}></Image>
                </Box>
                <Container>
                    <Box
                        display='flex'
                        height={'100%'}
                        position='relative'
                        alignItems={{ xs: 'end', md: 'initial' }}
                        flexDirection={{ xs: 'column', md: 'row' }}
                        zIndex={1}
                        ref={ref}>
                        <Box
                            marginTop={{ xs: '0.5em', md: '-25%' }}
                            marginRight={{ xs: 0, md: '3%' }}
                            textAlign='right'
                            component='h1'
                            fontWeight={'500'}
                            typography={{ xs: 'h3', md: 'h1' }}
                            alignSelf={'center'}
                            flex={{ xs: 'initial', md: '1' }}
                            textTransform='uppercase'>
                            {reactStringReplace(page.h1, /<highlight>/g, (match, i) => {
                                return (
                                    <Box color='primary.main' typography={{ xs: 'h3', md: 'h1' }} component='span'>
                                        {match}
                                    </Box>
                                );
                            })}
                        </Box>
                        <Button
                            sx={{ display: { xs: 'flex', md: 'none' } }}
                            variant='contained'
                            onClick={handleClickOpenModal}
                            startIcon={<TuneIcon></TuneIcon>}>
                            Оценить авто
                        </Button>
                        {renderApplication('desktop')}
                        <Modal onClose={handleCloseModal} open={isModalOpened}>
                            <Container>{renderApplication('mobile')}</Container>
                        </Modal>
                    </Box>
                </Container>
            </Box>
            <Container>
                <Box marginBottom='5em'>
                    <Box
                        component='h2'
                        sx={{ typography: { xs: 'h4', md: 'h3' } }}
                        fontWeight='500'
                        textAlign='center'
                        marginBottom='2em'>
                        {page.weProvideTitle}
                    </Box>
                    <Box display='flex' flexWrap='wrap' gap={'5%'}>
                        {page.weProvide.map((item, i) => (
                            <Box
                                width={{ xs: i === 1 ? '100%' : '45%', md: '30%' }}
                                order={{ xs: i === 1 ? '3' : 'initial', md: 'initial' }}
                                textAlign='center'
                                marginBottom='1em'
                                key={item.title}>
                                <Image
                                    title={item.image?.caption}
                                    src={item.image?.url}
                                    alt={item.image?.alternativeText}
                                    width={item.image?.width || 100}
                                    height={item.image?.height || 100}></Image>
                                <Typography variant='h6' marginBottom='0.5em'>
                                    {item.title}
                                </Typography>
                                <Typography color='text.secondary'>{item.description}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Box marginBottom='4em'>
                    <Typography
                        textAlign='center'
                        fontWeight='500'
                        textTransform='uppercase'
                        component='h2'
                        variant='h3'
                        marginBottom='1.5em'>
                        {reactStringReplace(page.purchasedCarsTitle, /<highlight>/g, (match, i) => {
                            return (
                                <Typography color='primary' variant='h3' component='span'>
                                    {match}
                                </Typography>
                            );
                        })}
                    </Typography>
                    <Box paddingX='1em'>
                        <Slider
                            className={styles.slider}
                            autoplaySpeed={5000}
                            autoplay
                            responsive={[
                                {
                                    breakpoint: breakpoints.values.sm,
                                    settings: {
                                        slidesToShow: 2,
                                        slidesToScroll: 1,
                                        infinite: true
                                    }
                                },
                                {
                                    breakpoint: breakpoints.values.lg,
                                    settings: {
                                        slidesToShow: cars.length < 4 ? cars.length : 4,
                                        slidesToScroll: 1,
                                        infinite: true
                                    }
                                }
                            ]}
                            slidesToShow={cars.length < 4 ? cars.length : 4}>
                            {cars.map((item) => {
                                let name = item.brand?.name + ' ' + item.model?.name;
                                return (
                                    <Box maxWidth='288px' paddingX='1em' width='100%' key={item.id}>
                                        {item.images && item.images.some((image) => image.formats) ? (
                                            <Slider
                                                swipe={false}
                                                pauseOnHover
                                                arrows={false}
                                                autoplay
                                                autoplaySpeed={3000}>
                                                {item.images.map((image) => (
                                                    <Image
                                                        title={image.caption}
                                                        key={image.id}
                                                        alt={image.alternativeText}
                                                        src={image.formats?.thumbnail.url || image.url}
                                                        width={263}
                                                        height={207}
                                                    />
                                                ))}
                                            </Slider>
                                        ) : (
                                            <Box>
                                                <Image
                                                    title={name}
                                                    style={{ margin: 'auto', width: '100%' }}
                                                    alt={name}
                                                    src={''}
                                                    width={263}
                                                    height={207}
                                                />
                                            </Box>
                                        )}
                                        <Typography
                                            textAlign='center'
                                            marginBottom='0.25em'
                                            variant='h6'
                                            title={name}
                                            lineClamp={1}>
                                            {name}
                                        </Typography>
                                        <Typography textAlign='center' variant='h5' title={name} lineClamp={1}>
                                            {item.priceUSD}$
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Slider>
                    </Box>
                </Box>
            </Container>
            <Box
                minHeight={{ xs: 350, md: 415 }}
                position='relative'
                paddingLeft={{ xs: 0, md: '5em' }}
                paddingBottom='1em'>
                <Container>
                    <Box
                        textTransform='uppercase'
                        component='h2'
                        fontWeight='500'
                        typography={{ xs: 'h4', md: 'h3' }}
                        marginBottom='1.5em'>
                        {reactStringReplace(page.advantagesTitle, /<highlight>/g, (match, i) => {
                            return (
                                <Box color='primary.main' typography={{ xs: 'h4', md: 'h3' }} component='span'>
                                    {match}
                                </Box>
                            );
                        })}
                    </Box>
                    <Box maxWidth={{ xs: 'calc(100% - 80px)', md: '100%' }} className={styles.list}>
                        {page.advantages.split('\n').map((item) => (
                            <Typography key={item} className={styles.list__item}>
                                {item}
                            </Typography>
                        ))}
                    </Box>
                </Container>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        right: 0,
                        width: { xs: '100px', md: 'initial' }
                    }}>
                    <Image
                        title={page.advantagesRightImage?.caption}
                        width={page.advantagesRightImage?.width}
                        height={page.advantagesRightImage?.height}
                        style={{ height: 'auto' }}
                        src={page.advantagesRightImage?.url}
                        alt={page.advantagesRightImage?.alternativeText}></Image>
                </Box>
            </Box>
            <Box padding='1em' bgcolor='#fff'>
                <Container>
                    <Box marginBottom={{ xs: '1em', md: '2em' }} typography={{ xs: 'h4', md: 'h3' }} textAlign='center'>
                        {reactStringReplace(page.buyAnyCarsTitle, /<highlight>/g, (match, i) => {
                            return (
                                <Box color='primary.main' typography={{ xs: 'h4', md: 'h3' }} component='span'>
                                    {match}
                                </Box>
                            );
                        })}
                    </Box>
                    <Box display='flex' flexWrap='wrap'>
                        {page.anyCarsAfter.map((item) => (
                            <Box
                                key={item.title}
                                width={{ xs: '50%', md: '33.3%' }}
                                marginBottom='3em'
                                textAlign='center'>
                                <Box display='flex' alignItems='center' width={115} height={115} margin='auto'>
                                    <Image
                                        title={item.image?.caption}
                                        width={item.image?.width || 100}
                                        height={item.image?.height || 100}
                                        alt={item.image?.alternativeText}
                                        src={item.image?.url}></Image>
                                </Box>
                                <Typography marginTop='1em' marginBottom='0.5em' variant='h6'>
                                    {item.title}
                                </Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    {item.description}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>
            <Box marginTop='176px' position='relative' textAlign='center'>
                <Box
                    position='absolute'
                    width={{ xs: '80%', md: '100%' }}
                    left={{ xs: '10%', md: 'initial' }}
                    top={'-176px'}>
                    <Image
                        title={page.sellImage?.caption}
                        width={page.sellImage?.width}
                        // style={{ height: 'auto' }}
                        height={page.sellImage?.height}
                        src={page.sellImage?.url}
                        alt={page.sellImage?.alternativeText}></Image>
                </Box>
                <Box bgcolor='primary.main' paddingTop={{ xs: '35%', md: '250px' }} minHeight={500}>
                    <Container>
                        <Box fontWeight='500' textAlign='center' marginBottom='1em' typography={{ xs: 'h4', md: 'h3' }}>
                            {page.sellCarTitle}
                        </Box>
                        <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} className={styles.steps}>
                            {page.sellSteps.map((item, i) => (
                                <Box
                                    key={item.title}
                                    display='flex'
                                    flexDirection='column'
                                    height={200}
                                    justifyContent='center'
                                    alignItems='center'
                                    width={{ xs: 'calc(100% - 100px)', md: ['25%', '30%', '35%'][i] }}
                                    className={styles.steps__item}>
                                    <Box typography={{ xs: 'h4', md: 'h2' }} marginBottom='0.25em' fontWeight='bold'>
                                        {item.title}
                                    </Box>
                                    <Typography maxWidth={250}>{item.description}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Container>
                </Box>
            </Box>
            <Box
                bgcolor='secondary.main'
                padding={{ xs: '1em 0', md: '2em 4em 3em' }}
                marginBottom={{ xs: '2em', md: '5em' }}>
                <Container>
                    <Box display='flex' alignItems='center'>
                        <Typography flex='1' marginRight={'1em'} color='#fff'>
                            <ReactMarkdown content={page.applicationLeftText}></ReactMarkdown>
                        </Typography>
                        <Button
                            sx={{
                                bgcolor: '#fff',
                                color: '#000',
                                textTransform: 'capitalize',
                                padding: { xs: '0.5em 1em', md: '1.5em 3em' },
                                borderRadius: 0
                            }}
                            variant='contained'
                            onClick={handleClickAssessment}>
                            Оценить автомобиль
                        </Button>
                    </Box>
                </Container>
            </Box>
            <Box className={styles['section-why-we']}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: { xs: '150px', md: 'initial' }
                    }}>
                    <Image
                        title={page.whyWeLeftImage?.caption}
                        width={page.whyWeLeftImage?.width}
                        height={page.whyWeLeftImage?.height}
                        src={page.whyWeLeftImage?.url}
                        alt={page.whyWeLeftImage?.alternativeText}></Image>
                </Box>
                <Container>
                    <Box maxWidth={650} paddingLeft='4em' marginLeft={{ xs: '80px', md: '350px' }}>
                        <Box marginBottom='1em' typography={{ xs: 'h4', md: 'h3' }}>
                            {page.whyWeTitle}
                        </Box>
                        <Box className={styles.list}>
                            {page.whyWe.split('\n').map((item) => (
                                <Typography key={item} className={styles.list__item}>
                                    {item}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default BuybackCars;

export const getStaticProps = getPageProps(
    fetchPage('buyback-car', {
        populate: [
            'seo',
            'mainBackgroundImage',
            'mainBackgroundLeftImage',
            'weProvide.image',
            'advantagesRightImage',
            'anyCarsAfter.image',
            'sellSteps',
            'sellImage',
            'whyWeLeftImage'
        ]
    }),
    async () => ({
        cars: (await fetchCarsOnParts({ pagination: { limit: 10 }, populate: ['brand', 'model', 'images'] })).data.data
    }),
    () => ({ hasGlobalContainer: false })
);
