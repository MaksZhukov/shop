import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { Link } from './Link';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
	variant?: MuiButtonProps['variant'] | 'link';
}

export const Button = (props: ButtonProps) => {
	const { variant, ...restProps } = props;

	if (variant === 'link' && props.href) {
		return (
			<Link size={props.size} href={props.href} sx={{ display: 'flex', gap: 1, ...props.sx }}>
				{props.children} {props.endIcon}
			</Link>
		);
	}
	return <MuiButton variant={variant === 'link' ? 'text' : variant} {...restProps} />;
};
