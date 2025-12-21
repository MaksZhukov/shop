import { SxProps, TypographyProps, Typography as UITypography } from '@mui/material';
import { FC } from 'react';

export const Typography: FC<TypographyProps & { component?: React.ElementType; lineClamp?: number }> = ({
	children,
	lineClamp,
	...props
}: TypographyProps & { component?: React.ElementType; lineClamp?: number }) => {
	let sx: SxProps = lineClamp
		? {
				display: '-webkit-box',
				WebkitBoxOrient: 'vertical',
				WebkitLineClamp: lineClamp,
				overflow: 'hidden',
				textOverflow: 'ellipsis'
		  }
		: {};

	return (
		<UITypography sx={{ ...sx, ...props.sx }} {...props}>
			{children}
		</UITypography>
	);
};
