import { Button, Tab, Table, TableBody, TableCell, TableRow, Tabs } from '@mui/material';
import { Typography, WhiteBox } from 'shared/ui';
import { ChevronDownIcon, ChevronUpIcon } from 'shared/icons';
import type { Product } from 'entities/product';
import { isSparePart } from 'entities/product';
import { useState } from 'react';

interface DescriptionItem {
	title: string;
	value: string | number | undefined;
}

interface Props {
	product: Product;
}

const TAB_VALUES = {
	DESCRIPTION: 'description',
	DELIVERY: 'delivery',
	GUARANTEE: 'guarantee',
	PAYMENT: 'payment'
} as const;

const getProductDescriptions = (product: Product): DescriptionItem[] => {
	if (!isSparePart(product)) {
		return [];
	}

	return [
		{ title: 'Год', value: product.year },
		{ title: 'Ориг.номер', value: product.id },
		{ title: 'Обьем двигателя', value: product.volume?.name },
		{ title: 'Тип топлива', value: product.fuel },
		{ title: 'Примечание', value: product.description },
		{ title: 'Маркировка двигателя', value: product.engine },
		{ title: 'КПП', value: product.transmission },
		{ title: 'Привод', value: product.id },
		{ title: 'Тип кузова', value: product.id }
	];
};

export const ProductTabs = ({ product }: Props) => {
	const [activeTab, setActiveTab] = useState<string>(TAB_VALUES.DESCRIPTION);
	const [isMoreFilters, setIsMoreFilters] = useState(false);

	const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
		setActiveTab(newValue);
	};

	const descriptions = getProductDescriptions(product);
	const visibleDescriptions = descriptions.slice(0, isMoreFilters ? descriptions.length : 5);

	const renderTabContent = () => {
		switch (activeTab) {
			case TAB_VALUES.DESCRIPTION:
				return (
					<>
						<Table sx={{ mt: 1 }}>
							<TableBody>
								{visibleDescriptions.map((item, index) => (
									<TableRow
										sx={{ backgroundColor: index % 2 === 0 ? 'custom.bg-surface-1' : 'initial' }}
										key={`${item.title}-${index}`}
									>
										<TableCell sx={{ minWidth: '200px', p: 1, border: 'none' }} padding='none'>
											<Typography>{item.title}</Typography>
										</TableCell>
										<TableCell
											sx={{ textAlign: 'right', p: 1, border: 'none' }}
											width='100%'
											padding='none'
										>
											<Typography>{item.value}</Typography>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						{descriptions.length > 5 && (
							<Button
								size='small'
								sx={{ alignSelf: 'flex-start', px: 1, mt: 1 }}
								onClick={() => setIsMoreFilters(!isMoreFilters)}
								endIcon={isMoreFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
							>
								{isMoreFilters ? 'Меньше параметров' : 'Больше параметров'}
							</Button>
						)}
					</>
				);
			case TAB_VALUES.DELIVERY:
				return <Typography>Доставка</Typography>;
			case TAB_VALUES.GUARANTEE:
				return <Typography>Гарантия</Typography>;
			case TAB_VALUES.PAYMENT:
				return <Typography>Оплата</Typography>;
			default:
				return null;
		}
	};

	return (
		<WhiteBox border={0} mb={{ xs: 3, md: 0 }} px={{ xs: 1, md: 2 }} py={{ xs: 0, md: 1.5 }}>
			<Tabs value={activeTab} onChange={handleTabChange}>
				<Tab label='Описание' value={TAB_VALUES.DESCRIPTION} />
				<Tab label='Доставка' value={TAB_VALUES.DELIVERY} />
				<Tab label='Гарантия' value={TAB_VALUES.GUARANTEE} />
				<Tab label='Оплата' value={TAB_VALUES.PAYMENT} />
			</Tabs>
			{renderTabContent()}
		</WhiteBox>
	);
};
