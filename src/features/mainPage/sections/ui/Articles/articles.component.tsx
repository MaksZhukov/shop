import { ArticleService, type Article } from 'entities/article';
import { inject, mainPageQueryFns, mainPageQueryKeys } from 'features/mainPage';
import { ArticlesHeader } from './articlesHeader.component';
import { ArticlesGrid } from './articlesGrid.component';
import { ApiResponse } from 'shared/api';
import { useQuery } from '@tanstack/react-query';
import { useDeviceType } from 'shared/hooks/useDeviceType';

export const Articles: React.FC = () => {
	const deviceType = useDeviceType();
	const articleReader = inject(ArticleService);
	const { data: articlesRes } = useQuery({
		queryKey: mainPageQueryKeys.articles(),
		queryFn: () => mainPageQueryFns.articles(articleReader),
		select: (res: ApiResponse<Article[]>) => res.data
	});
	const articles = articlesRes ?? [];
	const articlesLimit = deviceType === 'mobile' ? 5 : 8;
	const articlesToShow = (articles ?? []).slice(0, articlesLimit);

	if (!articles?.length) {
		return null;
	}

	return (
		<>
			<ArticlesHeader />
			<ArticlesGrid articles={articlesToShow} />
		</>
	);
};
