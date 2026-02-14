import { Box, Modal } from '@mui/material';
import { Filters, AutocompleteType, NumberType } from 'features/productFilters';
import { ModalContainer } from 'shared/ui';

interface CatalogFiltersModalProps {
	open: boolean;
	filtersConfig: (AutocompleteType | NumberType)[];
	filtersValues: { [key: string]: string | null };
	total?: number;
	onClose: () => void;
	onClickFind: () => void;
	onChangeFilterValues: (values: { [key: string]: string | null }) => void;
}

export const CatalogFiltersModal: React.FC<CatalogFiltersModalProps> = ({
	open,
	filtersConfig,
	filtersValues,
	total,
	onClose,
	onClickFind,
	onChangeFilterValues
}) => {
	const handleFind = () => {
		onClickFind();
		onClose();
	};

	return (
		<Modal
			sx={{
				overflow: 'auto'
			}}
			open={open}
			onClose={onClose}
		>
			<ModalContainer
				width='calc(100% - 1em)'
				sx={{
					m: 1,
					position: 'relative',
					top: '50%',
					transform: 'translateY(-50%)'
				}}
				onClose={onClose}
				title='Параметры поиска'
			>
				<Box pt={2}>
					<Filters
						total={total}
						config={filtersConfig}
						onClickFind={handleFind}
						values={filtersValues}
						onChangeFilterValues={onChangeFilterValues}
					/>
				</Box>
			</ModalContainer>
		</Modal>
	);
};
