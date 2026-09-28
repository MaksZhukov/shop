import { Box, Modal } from '@mui/material';
import type { AutocompleteType, NumberType } from 'features/productFilters';
import type { CatalogFilterPanelProps } from './catalog.component';
import { ModalContainer } from 'shared/ui';

interface CatalogFiltersModalProps {
	open: boolean;
	filtersConfig: (AutocompleteType | NumberType)[];
	filtersValues: { [key: string]: string | null };
	total?: number;
	onClose: () => void;
	onClickFind: () => void;
	onChangeFilterValues: (values: { [key: string]: string | null }) => void;
	renderFilters: (props: CatalogFilterPanelProps) => React.ReactNode;
}

export const CatalogFiltersModal: React.FC<CatalogFiltersModalProps> = ({
	open,
	filtersConfig,
	filtersValues,
	total,
	onClose,
	onClickFind,
	onChangeFilterValues,
	renderFilters
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
				<Box sx={{
                    pt: 2
                }}>
					{renderFilters({
						total,
						config: filtersConfig,
						onClickFind: handleFind,
						values: filtersValues,
						onChangeFilterValues
					})}
				</Box>
			</ModalContainer>
        </Modal>
    );
};
