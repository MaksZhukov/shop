import { Box, useMediaQuery } from '@mui/material';
import { Article } from 'api/articles/types';
import Image from 'components/features/Image';
import { Link } from 'components/ui';
import Typography from 'components/ui/Typography';

interface ArticleCardProps {
	article: Article;
	index: number;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, index }) => {
	const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
	const isFirstArticle = index === 0;
	const imageWidth = !isMobile || isFirstArticle ? 336 : 92;
	const imageHeight = !isMobile || isFirstArticle ? 190 : 92;

	const getImageUrl = (article: Article): string => {
		return article.mainImage?.formats?.small?.url || article.mainImage?.url || '';
	};

	const formatDate = (dateString: string): string => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};

	return (
		<Box
			width={{ xs: '100%', md: 340 }}
			overflow='hidden'
			display={{ xs: isFirstArticle ? 'block' : 'flex', md: 'block' }}
			bgcolor='background.paper'
			borderRadius={4}
			border={2}
			borderColor='background.paper'
		>
			<Image
				src={getImageUrl(article)}
				alt={article.name}
				style={{
					objectFit: 'cover',
					borderRadius: '16px',
					width: isFirstArticle ? '100%' : undefined
				}}
				width={imageWidth}
				height={imageHeight}
			/>
			<Box py={{ xs: 0.25, md: 1.75 }} px={{ xs: 1, md: 1.75 }}>
				<Link href={`/articles/${article.slug}`}>
					<Typography variant='h6' fontSize={{ xs: '18px', md: '22px' }} lineClamp={1}>
						{article.name}
					</Typography>
				</Link>
				<Typography mb={{ xs: 0, md: 1 }} height={42} variant='body1' lineClamp={2}>
					{article.name}
				</Typography>
				<Typography variant='body2' color='custom.text-muted'>
					{formatDate(article.createdAt)}
				</Typography>
			</Box>
		</Box>
	);
};
