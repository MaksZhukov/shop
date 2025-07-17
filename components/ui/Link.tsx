import { SxProps, Theme, TypographyProps } from '@mui/material';
import MuiLink from '@mui/material/Link';
import NextLink from 'next/link';
import { FC, HTMLAttributeAnchorTarget, ReactNode } from 'react';

interface LinkProps {
	href: string;
	children: ReactNode;
	target?: HTMLAttributeAnchorTarget;
	color?: string;
	size?: 'small' | 'medium' | 'large';
	sx?: SxProps<Theme>;
}

export const Link: FC<LinkProps> = ({ href, children, target, color, size = 'medium', sx }) => {
	const sizeStyles = {
		small: { fontSize: '0.75rem' },
		medium: { fontSize: '0.875rem' },
		large: { fontSize: '1rem' }
	};

	return (
		<NextLink href={href} target={target}>
			<MuiLink color={color} component='span' sx={{ ...sizeStyles[size], ...sx }}>
				{children}
			</MuiLink>
		</NextLink>
	);
};
