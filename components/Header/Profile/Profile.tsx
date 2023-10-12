import MenuIcon from '@mui/icons-material/Menu';
import {
	Badge,
	ClickAwayListener,
	Divider,
	Grow,
	IconButton,
	MenuItem,
	MenuList,
	Paper,
	Popper,
	Typography
} from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../../store';
import styles from './Profile.module.scss';

interface Props {
	onClickSignIn: () => void;
	onClickLogout: () => void;
}

const Profile = ({ onClickSignIn, onClickLogout }: Props) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const isOpened = !!anchorEl;
	const [isInvisibleBadge, setIsInvisibleBadge] = useState<boolean>(true);
	const isMountedAndLoadedData = useRef<boolean>(false);

	const store = useStore();
	const router = useRouter();

	useEffect(() => {
		if (store.isInitialRequestDone) {
			setTimeout(() => {
				isMountedAndLoadedData.current = true;
			}, 0);
		}
	}, [store.isInitialRequestDone]);

	useEffect(() => {
		if (isMountedAndLoadedData.current) {
			setIsInvisibleBadge(false);
		}
	}, [
		// store.cart.items.length
		store.favorites.items.length
	]);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		setIsInvisibleBadge(true);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClickLink = (path: string) => () => {
		router.push(path);
	};

	return (
		<>
			<IconButton
				sx={{ order: { xs: '1', md: 'initial' }, display: { xs: 'none', md: 'flex' } }}
				id='account-button'
				title='Меню'
				size='small'
				className={styles['button']}
				aria-controls={isOpened ? 'account-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={isOpened ? 'true' : undefined}
				onClick={handleClick}
			>
				<Badge color='warning' variant='dot' invisible={isInvisibleBadge}>
					<MenuIcon sx={{ color: 'white' }}></MenuIcon>
				</Badge>
			</IconButton>
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
										<MenuItem
											className={classNames({
												[styles['account-menu__item_active']]: router.pathname === '/profile'
											})}
											onClick={handleClickLink('/profile')}
										>
											Профиль
										</MenuItem>
									) : (
										<MenuItem onClick={onClickSignIn}>Войти</MenuItem>
									)}
									<MenuItem
										className={classNames({
											[styles['account-menu__item_active']]: router.pathname === '/favorites'
										})}
										onClick={handleClickLink('/favorites')}
									>
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
