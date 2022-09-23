import type { NextPage } from 'next';
import Catalog from 'components/Catalog';
import { Container } from '@mui/material';
import { Filters } from 'api/types';
import Head from 'next/head';
import { fetchTires } from 'api/tires/tires';
import { fetchWheels } from 'api/wheels/wheels';

const Wheels: NextPage = () => {
	const filtersConfig = [
		[
			{
				id: 'min',
				disabled: false,
				placeholder: 'Цена от',
				type: 'number',
			},
			{
				id: 'max',
				disabled: false,
				placeholder: 'Цена до',
				type: 'number',
			},
		],
		[
			{
				id: 'width',
				placeholder: 'Ширина',
				disabled: false,
				type: 'number',
			},
			{
				id: 'height',
				placeholder: 'Высота',
				disabled: false,
				type: 'number',
			},
		],
		[
			{
				id: 'diameter',
				placeholder: 'Диаметр',
				disabled: false,
				type: 'number',
			},
		],
	];

	const generateFiltersByQuery = ({
		min,
		max,
		...others
	}: {
		[key: string]: string;
	}): Filters => {
		let filters: Filters = {
			price: { $gte: min || undefined, $lte: max || undefined },
		};
		return { ...filters, ...others };
	};

	return (
		<>
			<Head>
				<title>Диски</title>
			</Head>
			<Container>
				<Catalog
					dataFieldsToShow={[
						{
							id: 'diameter',
							name: 'Диаметр',
						},
						{
							id: 'width',
							name: 'Ширина',
						},
						{
							id: 'height',
							name: 'Высота',
						},
					]}
					filtersConfig={filtersConfig}
					title='диски'
					fetchData={fetchWheels}
					generateFiltersByQuery={generateFiltersByQuery}></Catalog>
			</Container>
		</>
	);
};

export default Wheels;
