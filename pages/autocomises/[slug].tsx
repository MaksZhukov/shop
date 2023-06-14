import { fetchAutocomis } from 'api/autocomises/autocomises';
import { Autocomis as IAutocomis } from 'api/autocomises/types';
import Card from 'components/Card';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	page: IAutocomis;
}

const Autocomis: NextPage<Props> = ({ page }) => <Card data={page}></Card>;

export default Autocomis;

export const getServerSideProps = getPageProps(undefined, async (context) => ({
	page: (await fetchAutocomis(context.params?.slug as string)).data.data
}));
