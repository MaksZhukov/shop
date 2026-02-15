import { Button, Tab, Table, TableBody, TableCell, TableRow, Tabs } from '@mui/material';
import { Typography, WhiteBox } from 'shared/ui';
import { ChevronDownIcon, ChevronUpIcon } from 'shared/icons';
import type { Product } from 'entities/product';
import { getProductDescriptionItems } from 'entities/product';
import { useState } from 'react';

interface Props {
	product: Product;
}

const TAB_VALUES = {
	DESCRIPTION: 'description',
	DELIVERY: 'delivery',
	GUARANTEE: 'guarantee',
	PAYMENT: 'payment'
} as const;

const VISIBLE_DESCRIPTION_LIMIT = 5;

export const ProductTabs = ({ product }: Props) => {
	const [activeTab, setActiveTab] = useState<string>(TAB_VALUES.DESCRIPTION);
	const [isMoreFilters, setIsMoreFilters] = useState(false);

	const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
		setActiveTab(newValue);
	};

	const descriptions = getProductDescriptionItems(product);
	const visibleDescriptions = descriptions.slice(
		0,
		isMoreFilters ? descriptions.length : VISIBLE_DESCRIPTION_LIMIT
	);

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

						{descriptions.length > VISIBLE_DESCRIPTION_LIMIT && (
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
