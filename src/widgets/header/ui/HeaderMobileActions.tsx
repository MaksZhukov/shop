import { Box, IconButton } from '@mui/material';
import { FC } from 'react';
import { GeoIcon, SearchIcon } from 'shared/icons';

interface HeaderMobileActionsProps {
	onOpenMobileSearch: () => void;
	onOpenMobileContacts: () => void;
}

export const HeaderMobileActions: FC<HeaderMobileActionsProps> = ({
	onOpenMobileSearch,
	onOpenMobileContacts
}) => (
	<Box
		sx={{
			alignItems: 'center',
			gap: 0.5,
			display: { xs: 'flex', md: 'none' }
		}}
	>
		<IconButton sx={{ p: 0 }} onClick={onOpenMobileSearch} aria-label='Поиск'>
			<SearchIcon />
		</IconButton>
		<IconButton sx={{ p: 0 }} onClick={onOpenMobileContacts} aria-label='Контакты'>
			<GeoIcon />
		</IconButton>
	</Box>
);
