import type { Article } from 'entities/article/articleTypes';
import { ArticlesHeader } from './ArticlesHeader';
import { ArticlesGrid } from './ArticlesGrid';

interface ArticlesProps {
	articles: Article[];
}

export const Articles: React.FC<ArticlesProps> = ({ articles }) => {
	if (!articles?.length) {
		return null;
	}

	return (
		<>
			<ArticlesHeader />
			<ArticlesGrid articles={articles} />
		</>
	);
};
