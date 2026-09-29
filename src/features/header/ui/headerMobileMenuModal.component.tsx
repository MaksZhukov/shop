import { Box, Button, Drawer, List, ListItem, ListItemButton, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';
import { CloseIcon } from 'shared/icons';
import { useDI } from '../header.di';
import { HEADER_UTILITY_LINKS } from '../header.constants';

export const HeaderMobileMenuModal = reatomComponent(() => {
	const { headerStore } = useDI();
	const isOpened = headerStore.isMobileMenuOpened();
	const onClose = () => headerStore.isMobileMenuOpened.setFalse();
	const handleLinkClick = (href: string) => () => headerStore.openMobileMenuLink(href);

	return (
		<Drawer anchor='left' open={isOpened} onClose={onClose}>
			<Box sx={{ width: 280, pt: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pb: 2 }}>
					<Typography variant='h6' sx={{ fontWeight: 600 }}>
						Меню
					</Typography>
					<Button onClick={onClose} sx={{ minWidth: 'auto', p: 0.5 }}>
						<CloseIcon />
					</Button>
				</Box>
				<List sx={{ px: 1 }}>
					{HEADER_UTILITY_LINKS.map((link) => (
						<ListItem key={link.label} disablePadding>
							<ListItemButton onClick={handleLinkClick(link.href)} sx={{ py: 1.25, borderRadius: 1 }}>
								<Typography variant='body1'>{link.label}</Typography>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Box>
		</Drawer>
	);
});
