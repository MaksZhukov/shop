import { SxProps, Typography as UITypography, TypographyProps } from '@mui/material';
import styles from './Typography.module.scss';
import classNames from 'classnames';
const Typography = ({
	children,
	lineClamp,
	withSeparator,
	...props
}: TypographyProps & { component?: React.ElementType; lineClamp?: number; withSeparator?: boolean }) => {
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
		<UITypography
			sx={{ ...sx, ...props.sx }}
			{...props}
			className={classNames(props.className, withSeparator && styles['text_with-separator'])}
		>
			{children}
		</UITypography>
	);
};

export default Typography;
