import { autocomiseApi } from 'entities/autocomise';
import { Autocomis as IAutocomis } from 'entities/autocomise';
import { Card } from 'shared/ui';
import { NextPage } from 'next';
import { getPageProps } from 'shared/utils/pagePropsUtils';

interface Props {
	page: IAutocomis;
}

const Autocomis: NextPage<Props> = ({ page }) => <Card data={page}></Card>;

export default Autocomis;

export const getServerSideProps = getPageProps(undefined, async (context) => ({
	props: {
		page: (await autocomiseApi.fetchAutocomis(context.params?.slug as string)).data.data
	},
	breadcrumbs: [
		{ text: 'Главная', href: '/' },
		{ text: 'Автокомисы', href: '/autocomises' }
	]
}));
