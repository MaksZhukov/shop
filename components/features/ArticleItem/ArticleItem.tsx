import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Image as IImage } from 'api/types';
import Image from 'components/features/Image';
import ReactMarkdown from 'components/features/ReactMarkdown';
import { Link, Typography, WhiteBox } from 'shared/ui';
import { FC } from 'react';
import NextLink from 'next/link';
interface ArticleCardProps {
	image: IImage;
	description: string;
	name: string;
	date: string;
	link: string;
	width?: number | string;
	variant?: 'default' | 'compact';
}

export const ArticleItem: FC<ArticleCardProps> = ({
	image,
	description,
	name,
	date,
	link,
	width = 336,
	variant = 'default'
}) => {
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

	const imageWidth = variant === 'compact' && isMobile ? 92 : 336;
	const imageHeight = variant === 'compact' && isMobile ? 92 : 190;

	const formatDate = (dateString: string): string => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};

	const getImageUrl = (img: IImage): string => {
		return img?.formats?.small?.url || img?.url || '';
	};

	if (variant === 'compact') {
		return (
			<Box
				maxWidth={width}
				overflow='hidden'
				display='flex'
				bgcolor='background.paper'
				borderRadius={4}
				border={2}
				borderColor='background.paper'
			>
				<NextLink href={link}>
					<Image
						src={getImageUrl(image)}
						alt={name}
						style={{
							objectFit: 'cover',
							borderRadius: '16px',
							minWidth: imageWidth
						}}
						width={imageWidth}
						height={imageHeight}
					/>
				</NextLink>
				<Box py={{ xs: 0.25, md: 1.75 }} px={{ xs: 1, md: 1.75 }}>
					<Link href={link}>
						<Typography variant='h6' fontSize={{ xs: '18px', md: '22px' }} lineClamp={1}>
							{name}
						</Typography>
					</Link>
					<Typography mb={{ xs: 0, md: 1 }} height={42} variant='body1' lineClamp={2}>
						<ReactMarkdown inline content={description.substring(0, 300)} />
					</Typography>
					<Typography variant='body2' color='custom.text-muted'>
						{formatDate(date)}
					</Typography>
				</Box>
			</Box>
		);
	}

	return (
		<WhiteBox border='2px solid' borderColor={'background.paper'} overflow='hidden' maxWidth={width}>
			<NextLink href={link}>
				<Image
					title={image?.caption}
					alt={image?.alternativeText || name}
					width={336}
					height={190}
					style={{
						objectFit: 'cover',
						width: '100%'
					}}
					src={getImageUrl(image)}
				/>
			</NextLink>

			<Box px={1.5} py={1}>
				<Link lineClamp={1} color='text.secondary' sx={{ fontWeight: 700, fontSize: '18px' }} href={link}>
					{name}
				</Link>
				<Typography mb={1} lineClamp={2}>
					<ReactMarkdown inline content={description.substring(0, 300)} />
				</Typography>
				<Typography color='custom.text-muted' variant='body2'>
					{formatDate(date)}
				</Typography>
			</Box>
		</WhiteBox>
	);
};
