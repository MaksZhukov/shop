import { Box } from '@mui/material';
import { DefaultPage } from 'api/pages/types';
import { Image as IIamge } from 'api/types';
import GalleryImages from 'components/GalleryImages/GalleryImages';
import Image from 'components/Image';
import Typography from 'components/Typography';
import { FC, useState } from 'react';

interface Props {
	page: DefaultPage & { images: IIamge[] };
}

const Gallery: FC<Props> = ({ page }) => {
	const [index, setIndex] = useState<number | null>(null);
	const handleClickImage = (i: number) => () => {
		setIndex(i);
	};
	const handleClose = () => {
		setIndex(null);
	};
	return (
		<>
			<Typography component='h1' textTransform='uppercase' variant='h4' textAlign='center' marginBottom='1em'>
				{page.seo?.h1}
			</Typography>
			<Box display='flex' justifyContent='space-around' flexWrap='wrap' gap={'1em'}>
				{page.images?.map((item, i) => (
					<Box
						width={{ xs: '100%', md: 500 }}
						onClick={handleClickImage(i)}
						sx={{ cursor: 'pointer' }}
						key={item.id}
					>
						<Image
							title={item.caption}
							width={item.width > item.height ? 500 : 375}
							height={item.width > item.height ? 375 : 500}
							src={item.formats?.small?.url || item.url}
							style={{ maxHeight: '100%', height: 'auto', width: '100%' }}
							alt={item.alternativeText}
						></Image>
					</Box>
				))}
			</Box>

			<GalleryImages images={page.images} onClose={handleClose} selectedIndex={index}></GalleryImages>
		</>
	);
};

export default Gallery;
