import { Box, SxProps, Theme, Typography } from '@mui/material';
import { FC } from 'react';
import { Link } from '../Link';

interface BrandLogoProps {
	showLink?: boolean;
	compact?: boolean;
	sx?: SxProps<Theme>;
}

export const BrandLogo: FC<BrandLogoProps> = ({ showLink = true, compact = false, sx }) => {
	const logo = (
		<Box
			sx={{
				bgcolor: '#F6D748',
				px: compact ? 1 : { xs: 1.5, md: 2 },
				py: compact ? 0.75 : { xs: 1, md: 1.25 },
				display: 'inline-flex',
				flexDirection: 'column',
				alignItems: 'center',
				textAlign: 'center',
				maxWidth: '100%'
			}}
		>
			<Typography
				component='span'
				sx={{
					fontWeight: 700,
					fontSize: compact ? '13px' : { xs: '15px', md: '18px' },
					lineHeight: 1.2,
					color: 'custom.black',
					letterSpacing: '0.02em',
					textTransform: 'uppercase',
					whiteSpace: 'nowrap'
				}}
			>
				RAZBOR - AUTO
			</Typography>
			<Typography
				component='span'
				sx={{
					fontSize: compact ? '8px' : { xs: '10px', md: '11px' },
					lineHeight: 1.3,
					color: 'text.secondary',
					mt: 0.5,
					whiteSpace: 'nowrap'
				}}
			>
				Интернет-магазин б/у запчастей
			</Typography>
		</Box>
	);

	if (!showLink) {
		return <Box sx={sx}>{logo}</Box>;
	}

	return (
		<Link href='/' sx={{ display: 'inline-block', textDecoration: 'none', ...sx }}>
			{logo}
		</Link>
	);
};
