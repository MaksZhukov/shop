import { Typography } from '@mui/material';
import { pageApi, DefaultPage } from 'entities/page';
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

export const getStaticProps = getPageProps(pageApi.fetchPage('installment-plan'), async () => {
	return {
		props: {
			breadcrumbs: [
				{ text: 'Главная', href: '/' },
				{ text: 'Рассрочка', href: '/installment-plan' }
			]
		}
	};
});
