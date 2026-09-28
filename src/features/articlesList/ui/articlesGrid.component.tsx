import { Box } from '@mui/material';
import { ArticleItem, type Article } from 'entities/article';
import { Loader } from 'shared/ui';

interface ArticlesGridProps {
	articles?: Article[];
	isLoading: boolean;
}

export const ArticlesGrid = ({ articles, isLoading }: ArticlesGridProps) => {
	return (
        <Box
            sx={{
                display: 'flex',
                gap: { xs: 1, md: 2 },
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: { xs: 'column', md: 'row' }
            }}>
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
