import { Box, useMediaQuery } from '@mui/material';
import { ArticleItem, type Article } from 'entities/article';
import { ViewAllButton } from './ViewAllButton';

interface ArticlesGridProps {
	articles: Article[];
}

export const ArticlesGrid: React.FC<ArticlesGridProps> = ({ articles }) => {
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
	return (
        <Box
            sx={{
                display: 'flex',
                gap: { xs: 1, md: 2 },
                flexWrap: 'wrap',
                flexDirection: { xs: 'column', md: 'row' }
            }}>
            {articles.map((article, index) => (
				<ArticleItem
					key={article.id}
					image={article.mainImage}
					description={article.rightText}
					name={article.name}
					date={article.createdAt}
					link={`/articles/${article.slug}`}
					width={isMobile ? '100%' : 340}
					variant={isMobile ? (index === 0 ? 'default' : 'compact') : 'default'}
				/>
			))}
            <ViewAllButton title='Смотреть все новости' visibility='mobile' />
        </Box>
    );
};
