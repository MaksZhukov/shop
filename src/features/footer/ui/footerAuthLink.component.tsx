import { Box, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';
import { Link } from 'shared/ui';
import { useDI } from '../footer.di';

export const FooterAuthLink = reatomComponent(() => {
	const { userStore, openAuth } = useDI();

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
						onClick={openAuth}
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
