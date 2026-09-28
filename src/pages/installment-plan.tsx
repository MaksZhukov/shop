import { createRequestContainer } from 'app/di/app.container';
import { Typography } from '@mui/material';
import { PageService, DefaultPage } from 'entities/page';
import { ReactMarkdown } from 'shared/ui';
import { FC } from 'react';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: DefaultPage & { content: string };
}

const InstallmentPlan: FC<Props> = ({ page }) => {
	return (
        <>
            <Typography
                component='h1'
                variant='h4'
                sx={{
                    marginBottom: '1em',
                    textTransform: 'uppercase',
                    textAlign: 'center'
                }}>
				{page.seo?.h1 || 'Рассрочка'}
			</Typography>
            <ReactMarkdown content={page.content}></ReactMarkdown>
        </>
    );
};

export default InstallmentPlan;

export const getStaticProps = getPageProps(undefined, async () => {
	const pageService = createRequestContainer().get(PageService);
	const page = (await pageService.fetchPage('installment-plan')()).data.data;

	return {
		props: {
			page,
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'Рассрочка', href: '/installment-plan' }
			]
		}
	};
});
