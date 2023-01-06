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
import { useTheme } from '@mui/material';
import styles from './buyback-cars.module.scss';

interface Props {
	page: DefaultPage & { content: string };
	cars: CarOnParts[];
}

const BuybackCars = ({ page, cars }: Props) => {
	const { breakpoints } = useTheme();
	return (
		<>
			<WhiteBox>
				<ReactMarkdown content={page.content}></ReactMarkdown>
			</WhiteBox>
			<Typography gutterBottom textAlign='center' component='h2' variant='h4'>
				Наши выкупленные авто
			</Typography>
			{!!cars.length && (
				<Box paddingX='1em'>
					<Slider
						className={styles.slider}
						responsive={[
							{
								breakpoint: breakpoints.values.sm,
								settings: {
									slidesToShow: 1,
									slidesToScroll: 1,
									infinite: true,
								},
							},
							{
								breakpoint: breakpoints.values.md,
								settings: {
									slidesToShow: cars.length < 2 ? cars.length : 2,
									slidesToScroll: 1,
									infinite: true,
								},
							},
							{
								breakpoint: breakpoints.values.lg,
								settings: {
									slidesToShow: cars.length < 3 ? cars.length : 3,
									slidesToScroll: 1,
									infinite: true,
								},
							},
						]}
						// autoplaySpeed={5000}
						// autoplay
						slidesToShow={cars.length < 4 ? cars.length : 4}
					>
						{cars.map((item) => {
							let name = item.brand?.name + ' ' + item.model?.name;
							return (
								<WhiteBox maxWidth='288px' width='100%' key={item.id}>
									{item.images && item.images.some((image) => image.formats) ? (
										<Slider swipe={false} pauseOnHover arrows={false} autoplay autoplaySpeed={3000}>
											{item.images
												.filter((item) => item.formats)
												.map((image) => (
													<Image
														key={image.id}
														alt={image.alternativeText}
														src={image.formats?.thumbnail.url || image.url}
														width={200}
														height={150}
													/>
												))}
										</Slider>
									) : (
										<Image
											style={{ margin: 'auto' }}
											alt={name}
											src={''}
											width={200}
											height={150}
										/>
									)}
									<Typography
										textAlign='center'
										color='primary'
										marginTop='0.5em'
										variant='h6'
										title={name}
										lineClamp={1}
									>
										{name}
									</Typography>
								</WhiteBox>
							);
						})}
					</Slider>
				</Box>
			)}
		</>
	);
};

export default BuybackCars;

export const getStaticProps = getPageProps(fetchPage('buyback-car'), async () => ({
	cars: (await fetchCarsOnParts({ pagination: { limit: 10 }, populate: ['brand', 'model', 'images'] })).data.data,
}));
