import {
	SxProps,
	Typography as UITypography,
	TypographyProps,
} from '@mui/material';

const Typography = ({
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
				textOverflow: 'ellipsis',
		  }
		: {};

	return (
		<UITypography sx={{ ...sx, ...props.sx }} {...props}>
			{children}
		</UITypography>
	);
};

export default Typography;
