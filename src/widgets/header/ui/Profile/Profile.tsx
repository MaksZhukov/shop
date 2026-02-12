import { ClickAwayListener, Divider, Grow, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PersonIcon } from 'shared/icons/PersonIcon';
import { NavbarButton } from 'shared/ui/NavbarButton';
import { useUserStore } from 'entities/user';

interface Props {
	onClickSignIn: () => void;
	onClickLogout: () => void;
}

const Profile = ({ onClickSignIn, onClickLogout }: Props) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const isOpened = !!anchorEl;

	const userStore = useUserStore();
	const router = useRouter();

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClickSignIn = () => {
		setAnchorEl(null);
		onClickSignIn();
	};
	const handleClickLogout = () => {
		setAnchorEl(null);
		onClickLogout();
	};

	const handleClickLink = (path: string) => () => {
		setAnchorEl(null);
		router.push(path);
	};

	return (
		<>
			<NavbarButton title='Меню' size='small' icon={<PersonIcon />} onClick={handleClick}>
				Профиль
			</NavbarButton>
			<Popper
				open={isOpened}
				anchorEl={anchorEl}
				role={undefined}
				placement='bottom-end'
				transition
				disablePortal
			>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
						}}
					>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList id='composition-menu' aria-labelledby='composition-button'>
									{userStore.id ? (
										<MenuItem onClick={handleClickLink('/profile')}>Профиль</MenuItem>
									) : (
										<MenuItem onClick={handleClickSignIn}>Войти</MenuItem>
									)}
									{userStore.id && <Divider />}
									{userStore.id && <MenuItem onClick={handleClickLogout}>Выход</MenuItem>}
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</>
	);
};

export default observer(Profile);
