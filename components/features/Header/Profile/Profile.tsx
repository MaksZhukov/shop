import { ClickAwayListener, Divider, Grow, MenuItem, MenuList, Paper, Popper, Typography } from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useStore } from '../../../../store';
import { PersonIcon } from 'components/icons/PersonIcon';
import { NavbarButton } from 'components/ui/NavbarButton';

interface Props {
	onClickSignIn: () => void;
	onClickLogout: () => void;
}

const Profile = ({ onClickSignIn, onClickLogout }: Props) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const isOpened = !!anchorEl;

	const store = useStore();
	const router = useRouter();

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClickLink = (path: string) => () => {
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
									{store.user.id ? (
										<MenuItem onClick={handleClickLink('/profile')}>Профиль</MenuItem>
									) : (
										<MenuItem onClick={onClickSignIn}>Войти</MenuItem>
									)}
									<MenuItem onClick={handleClickLink('/favorites')}>
										Избранные{' '}
										<Typography component='span' color='primary' paddingLeft='5px'>
											({store.favorites.items.length})
										</Typography>
									</MenuItem>
									{store.user.id && <Divider />}
									{store.user.id && <MenuItem onClick={onClickLogout}>Выход</MenuItem>}
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
