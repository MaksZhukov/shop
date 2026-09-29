import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { reatomComponent } from '@reatom/react';
import { CloseIcon, MenuIcon } from 'shared/icons';
import { useDI } from '../../header.di';

export const CatalogButton = reatomComponent(() => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
	const { headerCatalogStore } = useDI();
	const catalogOpen = headerCatalogStore.isMenuOpened();

	return (
            <Button
				sx={{
					display: 'flex',
					flexShrink: 0,
					letterSpacing: '0.02em',
					px: { xs: 1.25, sm: 1.5, md: 2 },
					py: { xs: 1, md: 1.25 },
					minWidth: 'auto',
					whiteSpace: 'nowrap'
				}}
				size='medium'
				startIcon={!isMobile && catalogOpen ? <CloseIcon /> : <MenuIcon />}
				variant='contained'
				color='primary'
				onClick={(event) => headerCatalogStore.openMenu(event.currentTarget, isMobile)}
				aria-expanded={catalogOpen ? 'true' : undefined}
				aria-haspopup='true'
			>
				<Typography
					component='span'
					sx={{
						fontWeight: 600,
						typography: { xs: 'caption', sm: 'body2', md: 'body1' }
					}}
				>
					КАТАЛОГ
				</Typography>
			</Button>
	);
});
