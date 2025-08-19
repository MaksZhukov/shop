import { Box } from '@mui/material';
import { Article } from 'api/articles/types';
import { ArticleItem } from 'components/features/ArticleItem';
import { Loader } from 'components/ui';

interface ArticlesGridProps {
	articles?: Article[];
	isLoading: boolean;
}

export const ArticlesGrid = ({ articles, isLoading }: ArticlesGridProps) => {
	return (
		<Box
			display='flex'
			gap={{ xs: 1, md: 2 }}
			flexWrap='wrap'
			justifyContent='center'
			alignItems='center'
			flexDirection={{ xs: 'column', md: 'row' }}
		>
			{articles?.map((item) => (
				<ArticleItem
					key={item.id}
					image={item.mainImage}
					description={item.rightText}
					name={item.name}
					date={item.createdAt}
					link={`/articles/${item.slug}`}
				/>
			))}
			{isLoading && <Loader />}
		</Box>
	);
};
