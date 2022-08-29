import { Box, Typography } from '@mui/material';
import { Container } from '@mui/system';
import axios from 'axios';
import EmptyImageIcon from 'components/EmptyImageIcon';
import FavoriteButton from 'components/FavoriteButton';
import ShoppingCartButton from 'components/ShoppingCartButton';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Image from 'next/image';
import { FC, useEffect } from 'react';
import Slider from 'react-slick';
import { api } from '../../api';
import { fetchProduct } from '../../api/products/products';
import { Product } from '../../api/products/types';
import styles from './product.module.scss';

const { publicRuntimeConfig } = getConfig();

interface Props {
	data: Product;
}

const ProductPage = ({ data }: Props) => {
	return (
		<Container>
			<Box className={styles.product}>
				<Box
					marginBottom='1em'
					display='flex'
					alignItems='center'
					justifyContent='center'>
					<Typography
						variant='h4'
						flex='1'
						overflow='hidden'
						title={data.name}
						textOverflow='ellipsis'
						whiteSpace='nowrap'
						component='h1'>
						{data.name}
					</Typography>
					<ShoppingCartButton product={data}></ShoppingCartButton>
					<FavoriteButton product={data}></FavoriteButton>
				</Box>
				<Box display='flex'>
					{data.images ? (
						<Slider
							autoplay
							autoplaySpeed={3000}
							dots
							className={styles.slider}>
							{data.images.map((item) => (
								<Image
									key={item.id}
									alt={data.name}
									width={640}
									height={480}
									src={
										publicRuntimeConfig.backendLocalUrl +
										item.url
									}></Image>
							))}
						</Slider>
					) : (
						<EmptyImageIcon
							size={700}
							margin='-80px'></EmptyImageIcon>
					)}
					<Box flex='1' display='flex' width='200px'>
						<Box paddingX='1em' flex='1'>
							<Box>
								<Typography
									mr='1em'
									fontWeight='500'
									variant='subtitle1'
									component='span'>
									Артикул:
								</Typography>
								<Typography component='span'>
									{data.id}
								</Typography>
							</Box>
							<Box>
								<Typography
									mr='1em'
									fontWeight='500'
									variant='subtitle1'
									component='span'>
									Марка:
								</Typography>
								<Typography component='span'>
									{data.brand?.name}
								</Typography>
							</Box>
							<Box>
								<Typography
									mr='1em'
									fontWeight='500'
									variant='subtitle1'
									component='span'>
									Модель:
								</Typography>
								<Typography component='span'>
									{data.model?.name}
								</Typography>
							</Box>
							<Box>
								<Typography
									mr='1em'
									fontWeight='500'
									variant='subtitle1'
									component='span'>
									Запчасть:
								</Typography>
								<Typography component='span'>
									{data.sparePart?.name}
								</Typography>
							</Box>
						</Box>
						<Box>
							<Typography
								textAlign='right'
								variant='h5'
								width='100%'
								color='primary'>
								{data.price} р.
							</Typography>
							<Typography
								textAlign='right'
								variant='h5'
								width='100%'
								color='text.secondary'>
								~ {data.priceUSD?.toFixed()} $
							</Typography>
						</Box>
					</Box>
				</Box>
				<Box marginTop='1em'>
					<Typography
						mr='1em'
						fontWeight='500'
						variant='subtitle1'
						component='span'>
						Описание:
					</Typography>
					<Typography color='text.secondary'>
						{data.description}
					</Typography>
				</Box>
			</Box>
		</Container>
	);
};

export const getServerSideProps: GetServerSideProps<
	{},
	{ slug: string }
> = async (context) => {
	let data = null;
	let notFound = false;
	try {
		const response = await fetchProduct(context.params?.slug || '', true);

		data = response.data.data;
	} catch (err) {
		if (axios.isAxiosError(err)) {
			notFound = true;
		}
	}

	return {
		notFound,
		props: { data },
	};
};

export default ProductPage;
