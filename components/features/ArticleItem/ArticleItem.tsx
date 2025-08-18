import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Image as IImage } from 'api/types';
import Image from 'components/features/Image';
import ReactMarkdown from 'components/ReactMarkdown';
import { Link, Typography, WhiteBox } from 'components/ui';
import { FC } from 'react';

interface Props {
	image?: IImage;
	description: string;
	name: string;
	date: string;
	link: string;
	width?: number;
}

const ArticleItem: FC<Props> = ({ image, width = 340, description, name, date, link }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
	return (
		<WhiteBox border='2px solid' borderColor={'background.paper'} width={width} overflow='hidden'>
			<Image
				title={image?.caption}
				alt={image?.alternativeText || name}
				width={isMobile ? 400 : 336}
				height={190}
				style={{
					objectFit: 'cover'
				}}
				src={image?.formats?.small?.url || image?.url || ''}
			></Image>

			<Box px={1.5} py={1}>
				<Link lineClamp={1} color='text.secondary' sx={{ fontWeight: 700, fontSize: '18px' }} href={link}>
					{name}
				</Link>
				<Typography mb={1} lineClamp={2}>
					<ReactMarkdown inline content={description.substring(0, 300)} />
				</Typography>
				<Typography color='custom.text-muted' variant='body2'>
					{new Date(date).toLocaleDateString('ru-RU', {
						day: 'numeric',
						month: 'long',
						year: 'numeric'
					})}
				</Typography>
			</Box>
		</WhiteBox>
	);
};

export default ArticleItem;
