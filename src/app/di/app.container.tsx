import 'reflect-metadata';
import { useState, type ReactNode } from 'react';
import { Container } from 'inversify';
import { ARTICLE_API, ArticleApi, ArticleService } from 'entities/article';
import { DiProvider } from 'shared/di/di.context';

export const createAppContainer = () => {
	const container = new Container();
	container.bind(ARTICLE_API).to(ArticleApi);
	container.bind(ArticleService).toSelf();
	return container;
};

export const createRequestContainer = () => {
	const container = createAppContainer();
	return container;
};

export const AppDiProvider = ({ children }: { children: ReactNode }) => {
	const [container] = useState(createAppContainer);
	return <DiProvider container={container}>{children}</DiProvider>;
};
