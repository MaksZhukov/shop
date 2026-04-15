import { SxProps, TypographyProps, Typography as UITypography } from '@mui/material';
import { FC } from 'react';

export const Typography: FC<TypographyProps & { component?: React.ElementType; lineClamp?: number }> = ({
	children,
	lineClamp,
	sx,
	...props
}: TypographyProps & { component?: React.ElementType; lineClamp?: number }) => {
	const lineClampSx: SxProps = lineClamp
		? {
				display: '-webkit-box',
				WebkitBoxOrient: 'vertical',
				WebkitLineClamp: lineClamp,
				overflow: 'hidden',
				textOverflow: 'ellipsis'
			}
		: {};

	return (
		<UITypography sx={[lineClampSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} {...props}>
			{children}
		</UITypography>
	);
};
