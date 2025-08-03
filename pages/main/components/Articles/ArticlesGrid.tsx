import { Box } from '@mui/material';
import { Article } from 'api/articles/types';
import { ArticleCard } from './ArticleCard';
import { ViewAllButton } from './ViewAllButton';

interface ArticlesGridProps {
	articles: Article[];
}

export const ArticlesGrid: React.FC<ArticlesGridProps> = ({ articles }) => (
	<Box
		display='flex'
		gap={{ xs: 1, md: 2 }}
		flexWrap='wrap'
		justifyContent='center'
		alignItems='center'
		flexDirection={{ xs: 'column', md: 'row' }}
	>
		{articles.map((article, index) => (
			<ArticleCard key={article.id} article={article} index={index} />
		))}
		<ViewAllButton title='Смотреть все новости' visibility='mobile' />
	</Box>
);
