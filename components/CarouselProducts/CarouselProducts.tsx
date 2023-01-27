import { Box, useTheme } from '@mui/material';
import { Product } from 'api/types';
import ProductItem from 'components/ProductItem';
import { FC, ReactNode } from 'react';
import Slider from 'react-slick';
import styles from './CarouselProducts.module.scss';

interface Props {
    title?: ReactNode;
    slidesToShow?: number;
    data: Product[];
}

const CarouselProducts: FC<Props> = ({ title, data, slidesToShow = 4 }) => {
    const { breakpoints } = useTheme();

    return data.length ? (
        <Box paddingX="1.5em">
            {title}
            <Slider
                // autoplay
                // autoplaySpeed={5000}
                className={styles.slider}
                infinite
                slidesToShow={data.length < slidesToShow ? data.length : slidesToShow}
                slidesToScroll={1}
                responsive={[
                    {
                        breakpoint: breakpoints.values.sm,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            infinite: true
                        }
                    },
                    {
                        breakpoint: breakpoints.values.md,
                        settings: {
                            slidesToShow: data.length < 2 ? data.length : 2,
                            slidesToScroll: 1,
                            infinite: true
                        }
                    },
                    {
                        breakpoint: breakpoints.values.lg,
                        settings: {
                            slidesToShow: data.length < 3 ? data.length : 3,
                            slidesToScroll: 1,
                            infinite: true
                        }
                    }
                ]}>
                {data.map((item) => {
                    return (
                        <ProductItem key={item.id} width={data.length <= 4 ? 244 : '100%'} data={item}></ProductItem>
                    );
                })}
            </Slider>
        </Box>
    ) : (
        <></>
    );
};

export default CarouselProducts;
