import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { Link } from './Link';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
	variant?: ButtonProps['variant'] | 'link';
}

export const Button = (props: ButtonProps) => {
	if (props.variant === 'link' && props.href) {
		return (
			<Link size={props.size} href={props.href} sx={{ display: 'flex', gap: 1, ...props.sx }}>
				{props.children} {props.endIcon}
			</Link>
		);
	}
	return <MuiButton variant={props.variant} {...props} />;
};
