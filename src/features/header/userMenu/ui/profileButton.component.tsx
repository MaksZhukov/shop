import { IconButton } from '@mui/material';
import { reatomComponent } from '@reatom/react';
import { PersonIcon } from 'shared/icons/PersonIcon';
import { NavbarButton } from 'shared/ui/navbarButton.component';
import { useDI } from '../../header.di';

type ProfileButtonProps = {
	iconOnly?: boolean;
};

export const ProfileButton = reatomComponent(({ iconOnly = false }: ProfileButtonProps) => {
	const { userStore, userMenuStore } = useDI();
	const label = userStore.id ? 'Профиль' : 'Войти';
	const handleClick = (event: React.MouseEvent<HTMLElement>) => userMenuStore.clickProfile(event.currentTarget);

	if (iconOnly) {
		return (
			<IconButton onClick={handleClick} aria-label={label} sx={{ p: 0.75, color: 'custom.text-muted' }}>
				<PersonIcon />
			</IconButton>
		);
	}

	return (
		<NavbarButton
			title={label}
			size='small'
			icon={<PersonIcon />}
			onClick={handleClick}
			sx={{ height: 48, minWidth: 56, px: 1 }}
		>
			{label}
		</NavbarButton>
	);
});
