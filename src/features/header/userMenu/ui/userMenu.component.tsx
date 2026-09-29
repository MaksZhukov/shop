import { ClickAwayListener, Divider, Grow, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { reatomComponent } from '@reatom/react';
import { useDI } from '../../header.di';

const USER_MENU_Z_INDEX = 1300;

export const UserMenu = reatomComponent(() => {
	const { userStore, userMenuStore } = useDI();

	return (
		<Popper
			open={!!userStore.id && userMenuStore.isMenuOpened()}
			anchorEl={userMenuStore.menuAnchor()}
			role={undefined}
			placement='bottom-end'
			transition
			sx={{ zIndex: USER_MENU_Z_INDEX }}
		>
			{({ TransitionProps, placement }) => (
				<Grow
					{...TransitionProps}
					style={{
						transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
					}}
				>
					<Paper elevation={3}>
						<ClickAwayListener onClickAway={() => userMenuStore.closeMenu()}>
							<MenuList id='composition-menu' aria-labelledby='composition-button'>
								<MenuItem onClick={() => userMenuStore.openProfile()}>Профиль</MenuItem>
								<Divider />
								<MenuItem onClick={() => userMenuStore.logout()}>Выход</MenuItem>
							</MenuList>
						</ClickAwayListener>
					</Paper>
				</Grow>
			)}
		</Popper>
	);
});
