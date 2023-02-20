import { Link, Grid } from '@mui/material';
import { Box } from '@mui/system';
import Typography from 'components/Typography';
import NextLink from 'next/link';
import Slider from 'react-slick';
import Image from 'components/Image';
import { Car } from 'api/cars/types';

interface Props {
    dataFieldsToShow?: { name: string; value: string }[];
    activeView?: 'grid' | 'list';
    data: Car;
    width?: number | string;
    height?: number | string;
}

const CarItem = ({ data, dataFieldsToShow = [], activeView = 'grid', width = '100%', height = 'auto' }: Props) => {
    const renderContentByView = {
        list: (
            <Box padding="0.5em 1em" display="flex" flexDirection="column">
                <NextLink href={`/awaiting-cars/` + data.slug}>
                    <Link
                        variant="h6"
                        alignItems="center"
                        sx={{ color: '#000' }}
                        color="secondary"
                        component="span"
                        underline="hover"
                        fontWeight="500">
                        {data.name}
                    </Link>
                </NextLink>
                <Grid columnSpacing={2} container>
                    {dataFieldsToShow.map((item) => (
                        <Grid key={item.value} item>
                            <Typography fontWeight="500" component="div" variant="subtitle1">
                                {item.name}
                            </Typography>
                            {item.value}
                        </Grid>
                    ))}
                </Grid>
            </Box>
        ),
        grid: (
            <>
                <NextLink href={`/awaiting-cars/` + data.slug}>
                    <Link
                        height={60}
                        variant="body2"
                        display="flex"
                        alignItems="center"
                        sx={{ color: '#000' }}
                        justifyContent="center"
                        color="secondary"
                        component="span"
                        underline="hover"
                        fontWeight="500"
                        padding="0.25em"
                        marginTop="0.5em"
                        textAlign="center">
                        {data.name}
                    </Link>
                </NextLink>
            </>
        )
    };
    return (
        <Box
            marginBottom="1em"
            height={height}
            bgcolor="#fff"
            key={data.id}
            display={activeView === 'list' ? 'flex' : 'initial'}
            width={width}>
            {data.images ? (
                <Box width={activeView === 'list' ? 200 : '100%'}>
                    <Slider autoplay autoplaySpeed={5000} arrows={false}>
                        {data.images?.map((image) => (
                            <Image
                                key={image.id}
                                width={activeView === 'grid' ? 280 : 200}
                                height={activeView === 'grid' ? 215 : 150}
                                alt={image.alternativeText}
                                src={image.url}></Image>
                        ))}
                    </Slider>
                </Box>
            ) : (
                <Box>
                    <Image
                        title={data.name}
                        style={{ objectFit: 'cover' }}
                        src=""
                        width={activeView === 'grid' ? 280 : 200}
                        height={activeView === 'grid' ? 215 : 150}
                        alt={data.name}></Image>
                </Box>
            )}
            {renderContentByView[activeView]}
        </Box>
    );
};

export default CarItem;
