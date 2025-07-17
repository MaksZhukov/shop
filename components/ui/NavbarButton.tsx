import { Button, ButtonProps } from '@mui/material';

interface NavbarButtonProps extends ButtonProps {
	icon: React.ReactNode;
	isActive?: boolean;
}

export const NavbarButton = (props: NavbarButtonProps) => {
	return (
		<Button
			{...props}
			color='inherit'
			sx={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				height: '48px',
				fontSize: '10px',
				padding: '4px 8px',
				color: props.isActive ? 'text.secondary' : 'custom.text-muted'
			}}
		>
			{props.icon}
			{props.children}
		</Button>
	);
};
