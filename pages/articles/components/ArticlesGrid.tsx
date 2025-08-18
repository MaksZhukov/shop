import { Box } from '@mui/material';
import { Article } from 'api/articles/types';
import ArticleItem from 'components/features/ArticleItem';
import { Loader } from 'components/ui';

interface ArticlesGridProps {
	articles?: Article[];
	isLoading: boolean;
}

const ArticlesGrid = ({ articles, isLoading }: ArticlesGridProps) => {
	return (
		<Box display='flex' flexWrap='wrap' gap={1}>
			{articles?.map((item) => (
				<ArticleItem
					key={item.id}
					description={item.rightText}
					name={item.name}
					image={item.mainImage}
					link={`/articles/${item.slug}`}
					date={item.createdAt}
				/>
			))}
			{isLoading && <Loader />}
		</Box>
	);
};

export default ArticlesGrid;
