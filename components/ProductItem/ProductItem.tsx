import { Grid, Link, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { Product } from '../../api/types';
// import ShoppingCartButton from 'components/ShoppingCartButton';
import PercentIcon from '@mui/icons-material/Percent';
import Buy from 'components/Buy/Buy';
import FavoriteButton from 'components/FavoriteButton';
import Image from 'components/Image';
import Typography from 'components/Typography';
import NextLink from 'next/link';
import Slider from 'react-slick';
import { getProductTypeSlug } from 'services/ProductService';

interface Props {
	dataFieldsToShow?: { id: string; name: string }[];
	activeView?: 'grid' | 'list';
	data: Product;
	width?: number | string;
	minHeight?: number | string;
}

const ProductItem = ({
	data,
	dataFieldsToShow = [],
	activeView = 'grid',
	width = '100%',
	minHeight = 'auto'
}: Props) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	const [sold, setSold] = useState<boolean>(false);

	const handleSold = () => {
		setSold(true);
	};
	const renderContentByView = {
		list: (
			<Box
				padding='0.5em 1em'
				display='flex'
				flexDirection='column'
				width={{ xs: 'calc(100% - 150px)', sm: 'initial' }}
			>
				<NextLink prefetch={false} href={`/${getProductTypeSlug(data)}/` + data.slug}>
					<Link
						typography={'h6'}
						alignItems='center'
						sx={{
							color: '#000',
							display: '-webkit-box',
							WebkitBoxOrient: 'vertical',
							WebkitLineClamp: 2,
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						}}
						color='secondary'
						component='span'
						underline='hover'
						fontWeight='500'
					>
						{data.h1}
					</Link>
				</NextLink>
				<Grid sx={{ display: { xs: 'none', md: 'flex' } }} columnSpacing={2} container>
					{dataFieldsToShow.map((item) => (
						<Grid key={item.id} item>
							<Typography fontWeight='500' component='div' variant='subtitle1'>
								{item.name}
							</Typography>
							{typeof data[item.id as keyof Product] === 'object' &&
							data[item.id as keyof Product] !== null
								? //@ts-ignore
								  data[item.id as keyof Product]['name']
								: data[item.id as keyof Product]}
						</Grid>
					))}
				</Grid>
				<Box display='flex' marginTop='0.5em' flexWrap='wrap' alignItems='center' gap={'0.5em'}>
					<Box display='flex' flexDirection='column'>
						<Box display='flex' gap={1}>
							{!!data.discountPrice && (
								<>
									<Typography variant='h6'>Скидка:</Typography>
									<Typography fontWeight='bold' variant='h5' color='secondary'>
										{data.discountPrice} руб{' '}
									</Typography>
								</>
							)}
							{!!data.discountPriceUSD && (
								<Typography marginRight='1em' color='text.primary'>
									~{data.discountPriceUSD.toFixed()}$
								</Typography>
							)}
						</Box>
						<Box display='flex' gap={1} alignItems='center'>
							<Typography
								textAlign='center'
								fontWeight='bold'
								variant='h5'
								component={data.discountPrice ? 's' : 'p'}
								sx={{ opacity: data.discountPrice ? '0.8' : '1' }}
								color='secondary'
							>
								{data.price} руб{' '}
							</Typography>
							{!!data.priceUSD && (
								<Typography mr='0.25em' color='text.secondary'>
									~{data.priceUSD.toFixed()}$
								</Typography>
							)}
							{!!data.priceRUB && (
								<Typography color='text.secondary'>~{data.priceRUB.toFixed()}₽</Typography>
							)}
						</Box>
					</Box>
					{!sold && <Buy onSold={handleSold} products={[data]}></Buy>}
					<FavoriteButton product={data}></FavoriteButton>
				</Box>
			</Box>
		),
		grid: (
			<>
				<NextLink prefetch={false} href={`/${getProductTypeSlug(data)}/` + data.slug}>
					<Link
						height={60}
						variant='body2'
						display='flex'
						alignItems='center'
						sx={{ color: '#000' }}
						justifyContent='center'
						color='secondary'
						component='span'
						underline='hover'
						fontWeight='500'
						padding='0.25em'
						marginTop='0.5em'
						textAlign='center'
					>
						{data.h1}
					</Link>
				</NextLink>
				<Box display='flex' height={65} flexDirection='column' alignItems='center' justifyContent='center'>
					<Box display='flex' alignItems='center'>
						{!!data.discountPrice && (
							<>
								<Typography variant='h6'>Скидка:</Typography>
								<Typography
									paddingLeft='0.5em'
									fontWeight='bold'
									variant='h5'
									marginRight='0.5em'
									color='secondary'
								>
									{data.discountPrice} руб{' '}
								</Typography>
							</>
						)}
						{!!data.discountPriceUSD && (
							<Typography color='text.primary'>~{data.discountPriceUSD.toFixed()}$</Typography>
						)}
					</Box>
					<Box display='flex' alignItems='center'>
						<Typography
							marginRight='0.5em'
							textAlign='center'
							fontWeight='bold'
							variant='h5'
							component={data.discountPrice ? 's' : 'p'}
							sx={{ opacity: data.discountPrice ? '0.8' : '1' }}
							color='secondary'
						>
							{data.price} руб{' '}
						</Typography>
						{!!data.priceUSD && (
							<Typography mr='0.25em' color='text.secondary'>
								~{data.priceUSD.toFixed()}$
							</Typography>
						)}

						{!!data.priceRUB && <Typography color='text.secondary'>~{data.priceRUB.toFixed()}₽</Typography>}
					</Box>
				</Box>
				<Box display='flex' gap={'1em'} justifyContent='center' marginY='0.5em'>
					{!sold && <Buy onSold={handleSold} products={[data]}></Buy>}
					<FavoriteButton product={data}></FavoriteButton>
				</Box>
			</>
		)
	};
	return (
		<Box
			marginBottom='1em'
			minHeight={minHeight}
			bgcolor='#fff'
			key={data.id}
			display={activeView === 'list' ? 'flex' : 'initial'}
			width={width}
		>
			<NextLink prefetch={false} href={`/${getProductTypeSlug(data)}/` + data.slug}>
				{data.images ? (
					<Box width={activeView === 'list' ? (isMobile ? 150 : 200) : '100%'}>
						<Slider autoplay autoplaySpeed={5000} arrows={false}>
							{data.images?.map((image) => (
								<Image
									key={image.id}
									title={image.caption}
									width={activeView === 'grid' ? 280 : 200}
									height={activeView === 'grid' ? 215 : 150}
									alt={image.alternativeText}
									src={image.url}
								></Image>
							))}
						</Slider>
					</Box>
				) : (
					<Box>
						<Image
							title={data.h1}
							style={{
								objectFit: 'cover',
								margin: 'auto'
							}}
							src=''
							minWidth={activeView === 'list' ? (isMobile ? 150 : 200) : undefined}
							width={activeView === 'grid' ? 280 : isMobile ? 150 : 200}
							height={activeView === 'grid' ? 215 : 150}
							alt={data.h1}
						></Image>
					</Box>
				)}
			</NextLink>
			{renderContentByView[activeView]}
		</Box>
	);
};

export default ProductItem;
