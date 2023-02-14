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
    data: ICar | CarOnParts;
}

const Car: FC<Props> = ({ data }) => {
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    const [sliderBig, setSliderBig] = useState<Slider | null>(null);
    const [sliderSmall, setSliderSmall] = useState<Slider | null>(null);
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
    let name = data.brand?.name + ' ' + data.model?.name + ' ' + manufactureYear;
    return (
        <Box display="flex" marginTop="3em" gap={'2em'}>
            <Box display="flex" width="50%" maxHeight={480}>
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
                            className={classNames(styles.slider, styles.slider_small)}
                            asNavFor={sliderBig || undefined}>
                            {data.images.map((item) => (
                                <Box marginY="0.5em" key={item.id}>
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
                            className={styles.slider}>
                            {data.images.map((item) => (
                                <Box paddingX={'1em'} key={item.id}>
                                    <Image
                                        // style={{ height: '100%' }}
                                        title={item.caption}
                                        alt={item.alternativeText}
                                        width={440}
                                        height={480}
                                        src={item.url}></Image>
                                </Box>
                            ))}
                        </Slider>
                    </>
                ) : (
                    <Image
                        title={name}
                        alt={name}
                        quality={100}
                        width={540}
                        height={480}
                        style={{ objectFit: 'cover' }}
                        src=""></Image>
                )}
            </Box>
            <Box flex="1">
                <Typography variant="h4" fontWeight="500" title={name} component="h1">
                    {name}
                </Typography>
                <Box marginBottom="1em" alignItems="center" display="flex">
                    <Link marginRight="0.5em" variant="h6" href="tel:+375297804780">
                        +375 29 780 4 780
                    </Link>
                </Box>

                <Table sx={{ marginY: '2em' }}>
                    <TableBody>
                        {printOptions.map((item) => (
                            <TableRow key={item.value as string}>
                                <TableCell sx={{ border: 'none', padding: '0.5em 0 0.5em 0' }} padding="none">
                                    <Typography whiteSpace="nowrap" fontWeight="500">
                                        {item.text}
                                    </Typography>
                                </TableCell>
                                <TableCell width="100%" sx={{ border: 'none', paddingLeft: '2em' }} padding="none">
                                    <Typography>{item.value as string}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default Car;
