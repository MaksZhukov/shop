import { Box, Popover, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';
import { AsyncWrapper, Loader } from 'shared/ui';
import { useDI } from '../../header.di';
import { CatalogMenuContent } from './catalogMenuContent.component';

const CATALOG_LOAD_ERROR = 'Не удалось загрузить каталог, попробуйте позже';

// Mounted only while the popover is open, so reading topCategories here starts the lazy request.
const CatalogMenuBody = reatomComponent(() => {
	const { topCategories } = useDI().headerCatalogStore;
	const isLoading = !topCategories.ready() && topCategories.data().length === 0;

	return (
		<AsyncWrapper
			loading={isLoading}
			fallback={
				<Box sx={{ minWidth: 400, p: 4 }}>
					<Loader />
				</Box>
			}
			error={topCategories.error() !== undefined}
			errorFallback={
				<Typography variant='body1' sx={{ p: 4 }}>
					{CATALOG_LOAD_ERROR}
				</Typography>
			}
		>
			<CatalogMenuContent />
		</AsyncWrapper>
	);
});

export const CatalogMenu = reatomComponent(() => {
	const { headerCatalogStore } = useDI();

	return (
		<Popover
			disableScrollLock
			open={headerCatalogStore.isMenuOpened()}
			anchorEl={headerCatalogStore.menuAnchor()}
			onClose={() => headerCatalogStore.closeMenu()}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
			transformOrigin={{ vertical: 'top', horizontal: 'left' }}
		>
			<CatalogMenuBody />
		</Popover>
	);
});
