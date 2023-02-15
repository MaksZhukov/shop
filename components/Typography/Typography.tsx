import { SxProps, Typography as UITypography, TypographyProps, useMediaQuery } from '@mui/material';
import styles from './Typography.module.scss';
import classNames from 'classnames';
const Typography = ({
    children,
    lineClamp,
    withSeparator,
    ...props
}: TypographyProps & { component?: React.ElementType; lineClamp?: number; withSeparator?: boolean }) => {
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
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
        <UITypography
            sx={{ ...sx, ...props.sx }}
            {...props}
            className={classNames(
                props.className,
                withSeparator && styles['text_with-separator'],
                withSeparator && isMobile && styles['text_with-separator_mobile']
            )}>
            {children}
        </UITypography>
    );
};

export default Typography;
