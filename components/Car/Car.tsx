import { Box } from '@mui/system';
import { CarOnParts } from 'api/cars-on-parts/types';
import { Car as ICar } from 'api/cars/types';
import Image from 'components/Image';
import Typography from 'components/Typography';
import WhiteBox from 'components/WhiteBox';
import { FC, useState } from 'react';
import ReactPlayer from 'react-player';
import Slider from 'react-slick';
import { isCarOnsPartParts } from 'services/CarsService';
import styles from './Car.module.scss';
import { Button, Link, Table, TableBody, TableCell, TableRow, useMediaQuery } from '@mui/material';
import classNames from 'classnames';

interface Props {
    data: ICar;
}

const Car: FC<Props> = ({ data }) => {
    const [sliderBig, setSliderBig] = useState<Slider | null>(null);
    const [sliderSmall, setSliderSmall] = useState<Slider | null>(null);
    const isTablet = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    let printOptions = [
        { text: 'Артикул', value: data.id },
        { text: 'Марка', value: data.brand?.name },
        { text: 'Модель', value: data.model?.name },
        { text: 'Поколение', value: data.generation?.name },
        { text: 'Тип кузова', value: data.bodyStyle },
        { text: 'Коробка', value: data.transmission },
        { text: 'Двигатель', value: data.engine },
        { text: 'Тип топлива', value: data.fuel },
        { text: 'Обьем', value: data.volume?.name },
        {
            text: 'Год',
            value: data.manufactureDate
        },
        {
            text: 'Дата поставки',
            value: data.deliveryDate
        },
        { text: 'Пробег', value: data.mileage }
    ];

    let manufactureYear = new Date(data.manufactureDate).getFullYear();

    return (
        <>
            <Box display='flex' marginTop='3em' gap={'2em'} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                <Box>
                    <Box display='flex' sx={{ width: { xs: '100%', md: '570px' } }} maxHeight={isMobile ? 360 : 480}>
                        {data.images ? (
                            <>
                                <Slider
                                    ref={(ref) => {
                                        setSliderSmall(ref);
                                    }}
                                    swipeToSlide
                                    verticalSwiping
                                    vertical
                                    arrows={false}
                                    slidesToShow={4}
                                    focusOnSelect
                                    className={classNames(
                                        styles.slider,
                                        styles.slider_small,
                                        isMobile && styles.slider_small_mobile
                                    )}
                                    asNavFor={sliderBig || undefined}>
                                    {data.images.map((item) => (
                                        <Box marginY='0.5em' key={item.id}>
                                            <Image
                                                title={item.caption}
                                                alt={item.alternativeText}
                                                width={104}
                                                height={78}
                                                src={item.formats?.thumbnail.url || item.url}></Image>
                                        </Box>
                                    ))}
                                </Slider>
                                <Slider
                                    ref={(ref) => {
                                        setSliderBig(ref);
                                    }}
                                    asNavFor={sliderSmall || undefined}
                                    arrows={false}
                                    autoplay
                                    autoplaySpeed={5000}
                                    className={classNames(styles.slider, isMobile && styles.slider_mobile)}>
                                    {data.images.map((item) => (
                                        <Box paddingX={'1em'} key={item.id}>
                                            <Image
                                                // style={{ height: '100%' }}
                                                title={item.caption}
                                                alt={item.alternativeText}
                                                width={440}
                                                height={isMobile ? 360 : 480}
                                                src={item.url}></Image>
                                        </Box>
                                    ))}
                                </Slider>
                            </>
                        ) : (
                            <Image
                                title={data.name}
                                alt={data.name}
                                quality={100}
                                width={540}
                                height={360}
                                style={{ objectFit: 'cover' }}
                                src=''></Image>
                        )}
                    </Box>
                    {data.videoLink && (
                        <ReactPlayer
                            width={'100%'}
                            height={isMobile ? 240 : 360}
                            controls
                            style={{ marginTop: '1em' }}
                            url={data.videoLink}></ReactPlayer>
                    )}
                </Box>

                <Box flex='1'>
                    <Typography variant='h4' fontWeight='500' title={data.name} component='h1'>
                        {data.name}
                    </Typography>
                    <Box marginBottom='1em' alignItems='center' display='flex'>
                        <Link marginRight='0.5em' variant='h6' href='tel:+375297804780'>
                            +375 29 780 4 780
                        </Link>
                    </Box>

                    <Table sx={{ marginY: '2em' }}>
                        <TableBody>
                            {printOptions.map((item) => (
                                <TableRow key={item.value as string}>
                                    <TableCell sx={{ border: 'none', padding: '0.5em 0 0.5em 0' }} padding='none'>
                                        <Typography whiteSpace='nowrap' fontWeight='500'>
                                            {item.text}
                                        </Typography>
                                    </TableCell>
                                    <TableCell width='100%' sx={{ border: 'none', paddingLeft: '2em' }} padding='none'>
                                        <Typography>{item.value as string}</Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Box>
        </>
    );
};

export default Car;
