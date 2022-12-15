import { fetchAutocomis } from 'api/autocomises/autocomises';
import { Autocomis as IAutocomis } from 'api/autocomises/types';
import Card from 'components/Card';
import { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';

interface Props {
	data: IAutocomis;
}

const Autocomis: NextPage<Props> = ({ data }) => <Card data={data}></Card>;

export default Autocomis;

export const getServerSideProps = getPageProps(undefined, async (context) => ({
	data: (await fetchAutocomis(context.params?.slug as string)).data.data,
}));
