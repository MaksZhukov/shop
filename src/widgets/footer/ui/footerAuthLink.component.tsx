import { Box, Typography } from '@mui/material';
import { useUserStore } from 'entities/user';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Link } from 'shared/ui';

interface FooterAuthLinkProps {
	onSignInClick: () => void;
}

export const FooterAuthLink: FC<FooterAuthLinkProps> = observer(({ onSignInClick }) => {
	const userStore = useUserStore();

	return (
		<Box component='nav' sx={{ display: 'flex', flexDirection: 'column' }}>
			<Typography variant='body2' sx={{ mb: 1, lineHeight: 1.6 }}>
				{userStore.id ? (
					<Link href='/profile' sx={{ color: 'text.primary', fontWeight: 400 }}>
						Профиль
					</Link>
				) : (
					<Box
						component='button'
						type='button'
						onClick={onSignInClick}
						sx={{
							border: 'none',
							background: 'none',
							padding: 0,
							cursor: 'pointer',
							font: 'inherit',
							color: 'text.primary',
							fontWeight: 400,
							fontSize: '14px',
							textAlign: 'left'
						}}
					>
						Вход / Регистрация
					</Box>
				)}
			</Typography>
		</Box>
	);
});
