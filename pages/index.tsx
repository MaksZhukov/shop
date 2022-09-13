import type { NextPage } from 'next';
import { fetchProducts } from 'api/spareParts/spareParts';
import Catalog from 'components/Catalog';
import { Container } from '@mui/material';

const Home: NextPage = () => {
	return (
		<Container>
			<Catalog
				dataFieldsToShow={[
					{
						id: 'brand',
						name: 'Марка',
					},
					{
						id: 'model',
						name: 'Модель',
					},
					{
						id: 'sparePart',
						name: 'Запчасть',
					},
					{
						key: 'description',
						name: 'Описание',
					},
				]}
				title='Запчасти'
				fetchData={fetchProducts}></Catalog>
		</Container>
	);
};

export default Home;
