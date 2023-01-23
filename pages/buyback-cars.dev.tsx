import WhiteBox from 'components/WhiteBox';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage } from 'api/pages/types';
import ReactMarkdown from 'components/ReactMarkdown';
import { fetchCarsOnParts } from 'api/cars-on-parts/cars-on-parts';
import { CarOnParts } from 'api/cars-on-parts/types';
import Slider from 'react-slick';
import { Box } from '@mui/system';
import Image from 'components/Image';
import Typography from 'components/Typography';
import { Button, CircularProgress, Container, Input, TextField, useTheme } from '@mui/material';
import styles from './buyback-cars.module.scss';
import Autocomplete from 'components/Autocomplete';
import { Brand } from 'api/brands/types';
import { ChangeEvent, FormEventHandler, MouseEvent, useState } from 'react';
import { Model } from 'api/models/types';
import { fetchModels } from 'api/models/models';
import { MAX_LIMIT } from 'api/constants';
import { useSnackbar } from 'notistack';
import { YEARS } from '../constants';
import InputMask from 'react-input-mask';
import { send } from 'api/email';

interface Props {
    page: DefaultPage & { content: string };
    brands: Brand[];
    cars: CarOnParts[];
}

const BuybackCars = ({ page, cars, brands }: Props) => {
    const { breakpoints } = useTheme();
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
    const [year, setYear] = useState<string | null>(null);
    const [phone, setPhone] = useState<string>('');

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
                pagination: { limit: MAX_LIMIT }
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

    const handleClickSend: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            await send(
                'Запрос на выкуп авто',
                `<b>Телефон</b>: ${phone} <br /><b>Марка</b>: ${brand?.label} <br /><b>Модель</b>: ${model?.label} <br /><b>Год</b>: ${year} <br />`
            );
        } catch (err) {
            enqueueSnackbar('Произошла какая-то ошибка при отправке, обратитесь в поддержку', {
                variant: 'error'
            });
        }
    };

    return (
        <>
            <Box className={styles.head} minHeight={744} display="flex">
                <Container>
                    <Box display="flex" position="relative" zIndex={1}>
                        <Typography textTransform="uppercase">
                            Выкуп <Typography component="span">авто</Typography> на З/Ч
                        </Typography>
                        <Box
                            maxWidth={510}
                            borderRadius="2em"
                            padding="1em"
                            bgcolor="secondary.main"
                            textAlign="center"
                            onSubmit={handleClickSend}
                            component="form"
                            width={510}>
                            <Typography variant="h6" color="#fff" fontWeight="bold" marginBottom="0.5em">
                                Оценить автомобиль
                            </Typography>
                            <Autocomplete
                                className={styles.autocomplete}
                                required
                                value={brand}
                                placeholder="Выберите марку"
                                onChange={handleChangeAutocomplete(setBrand, () => {
                                    setModel(null);
                                    setModels([]);
                                })}
                                options={brands.map((item) => ({ label: item.name, value: item.slug }))}></Autocomplete>
                            <Autocomplete
                                className={styles.autocomplete}
                                required
                                value={model}
                                placeholder="Выберите модель"
                                disabled={!brand}
                                noOptionsText={noOptionsText}
                                onOpen={handleOpenAutocompleteModels}
                                onChange={handleChangeAutocomplete(setModel)}
                                options={models.map((item) => ({ label: item.name, value: item.name }))}></Autocomplete>
                            <Autocomplete
                                className={styles.autocomplete}
                                value={year}
                                placeholder="Укажите год выпуска"
                                onChange={handleChangeAutocomplete(setYear)}
                                options={YEARS.map((item) => item.toString())}></Autocomplete>
                            <InputMask
                                required
                                mask="+375 99 999 99 99"
                                value={phone}
                                maskChar=" "
                                onChange={handleChangePhone}>
                                {
                                    //@ts-ignore
                                    () => <Input required placeholder="Ваш телефон" fullWidth></Input>
                                }
                            </InputMask>
                            <Button type="submit" variant="contained">
                                Оставить заявку
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default BuybackCars;

export const getStaticProps = getPageProps(
    fetchPage('buyback-car'),
    async () => ({
        cars: (await fetchCarsOnParts({ pagination: { limit: 10 }, populate: ['brand', 'model', 'images'] })).data.data
    }),
    () => ({ hasGlobalContainer: false })
);
