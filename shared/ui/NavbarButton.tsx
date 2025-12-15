import { FC } from 'react';
import { Button, ButtonProps } from './Button';

interface NavbarButtonProps extends ButtonProps {
	icon: React.ReactNode;
	isActive?: boolean;
}

export const NavbarButton: FC<NavbarButtonProps> = (props) => {
	return (
		<Button
			{...props}
			color='inherit'
			sx={{
				display: 'flex',
				gap: 1,
				lineHeight: 1,
				alignItems: 'center',
				flexDirection: 'column',
				height: '48px',
				fontSize: '10px',
				padding: '2px 8px',
				color: props.isActive ? 'text.secondary' : 'custom.text-muted'
			}}
		>
			{props.icon}
			{props.children}
		</Button>
	);
};
