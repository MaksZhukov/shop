import { createRequestContainer } from 'app/di/app.container';
import { PageService, DefaultPage } from 'entities/page';
import { ReactMarkdown } from 'shared/ui';
import { Typography } from 'shared/ui';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: DefaultPage & { content: string };
}

const Contacts = ({ page }: Props) => {
	return (
		<>
			<Typography component='h1' variant='h4' align='center' sx={{ mb: '1em', textTransform: 'uppercase' }}>
				{page.seo?.h1 || 'Оплата'}
			</Typography>
			<ReactMarkdown content={page.content}></ReactMarkdown>
		</>
	);
};

export default Contacts;

export const getStaticProps = getPageProps(undefined, async () => {
	const pageService = createRequestContainer().get(PageService);
	const page = (await pageService.fetchPage('payment')()).data.data;

	return {
		props: {
			page,
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'Оплата', href: '/payment' }
			]
		}
	};
});
