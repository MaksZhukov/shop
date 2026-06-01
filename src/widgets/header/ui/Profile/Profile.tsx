import { ClickAwayListener, Divider, Grow, IconButton, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PersonIcon } from 'shared/icons/PersonIcon';
import { NavbarButton } from 'shared/ui/NavbarButton';
import { useUserStore } from 'entities/user';

interface Props {
	onClickSignIn: () => void;
	onClickLogout: () => void;
	iconOnly?: boolean;
}

const PROFILE_MENU_Z_INDEX = 1300;

const Profile = ({ onClickSignIn, onClickLogout, iconOnly = false }: Props) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const isOpened = !!anchorEl;

	const userStore = useUserStore();
	const router = useRouter();

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		if (!userStore.id) {
			onClickSignIn();
			return;
		}
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClickLogout = () => {
		setAnchorEl(null);
		onClickLogout();
	};

	const handleClickLink = (path: string) => () => {
		setAnchorEl(null);
		router.push(path);
	};

	const label = userStore.id ? 'Профиль' : 'Войти';

	const profileMenu = userStore.id ? (
		<Popper
			open={isOpened}
			anchorEl={anchorEl}
			role={undefined}
			placement='bottom-end'
			transition
			sx={{ zIndex: PROFILE_MENU_Z_INDEX }}
		>
			{({ TransitionProps, placement }) => (
				<Grow
					{...TransitionProps}
					style={{
						transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
					}}
				>
					<Paper elevation={3}>
						<ClickAwayListener onClickAway={handleClose}>
							<MenuList id='composition-menu' aria-labelledby='composition-button'>
								<MenuItem onClick={handleClickLink('/profile')}>Профиль</MenuItem>
								<Divider />
								<MenuItem onClick={handleClickLogout}>Выход</MenuItem>
							</MenuList>
						</ClickAwayListener>
					</Paper>
				</Grow>
			)}
		</Popper>
	) : null;

	if (iconOnly) {
		return (
			<>
				<IconButton
					onClick={handleClick}
					aria-label={label}
					sx={{ p: 0.75, color: 'custom.text-muted' }}
				>
					<PersonIcon />
				</IconButton>
				{profileMenu}
			</>
		);
	}

	return (
		<>
			<NavbarButton
				title={label}
				size='small'
				icon={<PersonIcon />}
				onClick={handleClick}
				sx={{ height: 48, minWidth: 56, px: 1 }}
			>
				{label}
			</NavbarButton>
			{profileMenu}
		</>
	);
};

export default observer(Profile);
