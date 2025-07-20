import { Button as MuiButton, ButtonProps } from '@mui/material';
import { Link } from './Link';

interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
	variant?: ButtonProps['variant'] | 'link';
}

export const Button = (props: CustomButtonProps) => {
	if (props.variant === 'link' && props.href) {
		return (
			<Link size={props.size} href={props.href} sx={{ display: 'flex', gap: 1, ...props.sx }}>
				{props.children} {props.endIcon}
			</Link>
		);
	}
	return <MuiButton variant={props.variant} {...props} />;
};
