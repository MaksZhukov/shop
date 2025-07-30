import { SxProps, Theme } from '@mui/material';
import MuiLink from '@mui/material/Link';
import NextLink from 'next/link';
import { FC, HTMLAttributeAnchorTarget, ReactNode } from 'react';

interface LinkProps {
	href: string;
	children: ReactNode;
	target?: HTMLAttributeAnchorTarget;
	color?: string;
	size?: 'small' | 'medium' | 'large';
	lineClamp?: number;
	sx?: SxProps<Theme>;
}

export const Link: FC<LinkProps> = ({ href, children, target, color, size = 'medium', lineClamp, sx }) => {
	const sizeStyles = {
		small: { fontSize: '0.75rem' },
		medium: { fontSize: '0.875rem' },
		large: { fontSize: '1rem' }
	};
	const lineClampStyles = lineClamp
		? {
				display: '-webkit-box' as const,
				WebkitBoxOrient: 'vertical' as const,
				WebkitLineClamp: lineClamp,
				overflow: 'hidden' as const,
				textOverflow: 'ellipsis' as const
		  }
		: {};
	return (
		<NextLink href={href} style={{ pointerEvents: sx?.pointerEvents }} target={target}>
			<MuiLink color={color} component='span' sx={{ ...sizeStyles[size], ...sx }} style={lineClampStyles}>
				{children}
			</MuiLink>
		</NextLink>
	);
};
