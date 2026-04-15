import { Box } from '@mui/material';
import type { DefaultPage } from 'entities/page';
import type { Image as IIamge } from 'shared/api/types';
import { GalleryImages } from 'shared/ui/GalleryImages';
import { Image } from 'shared/ui';
import { Typography } from 'shared/ui';
import { FC, useState } from 'react';

interface Props {
	page: DefaultPage & { images: IIamge[] };
}

export const Gallery: FC<Props> = ({ page }) => {
	const [index, setIndex] = useState<number | null>(null);
	const handleClickImage = (i: number) => () => {
		setIndex(i);
	};
	const handleClose = () => {
		setIndex(null);
	};
	return (
        <>
			<Typography component='h1' variant='h4' align='center' sx={{ textTransform: 'uppercase', mb: '1em' }}>
				{page.seo?.h1}
			</Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    gap: '1em'
                }}>
				{page.images?.map((item, i) => (
					<Box
                        onClick={handleClickImage(i)}
                        key={item.id}
                        sx={{
                            width: { xs: '100%', md: 500 },
                            cursor: 'pointer'
                        }}>
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
