import { Box, Typography } from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';
import { FOOTER_LEGAL_LINKS, FOOTER_LEGAL_TEXT } from '../footerConstants';

export const FooterLegal: FC = () => {
	const currentYear = new Date().getFullYear();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: { xs: 'column', lg: 'row' },
				justifyContent: 'space-between',
				alignItems: { xs: 'center', lg: 'flex-start' },
				gap: 2,
				py: { xs: 2.5, md: 3 },
				textAlign: { xs: 'center', lg: 'left' }
			}}
		>
			<Typography
				variant='body2'
				color='text.secondary'
				sx={{ maxWidth: { xs: '100%', lg: 720 }, lineHeight: 1.5, fontSize: '12px' }}
			>
				© 2009–{currentYear}. {FOOTER_LEGAL_TEXT}
			</Typography>

			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', lg: 'row' },
					alignItems: { xs: 'center', lg: 'flex-start' },
					flexWrap: 'wrap',
					gap: { xs: 1, lg: 2.5 },
					flexShrink: 0
				}}
			>
				{FOOTER_LEGAL_LINKS.map(({ href, label }) => (
					<Typography key={label} variant='body2' sx={{ fontSize: '12px' }}>
						<NextLink
							href={href}
							style={{ color: 'inherit', textDecoration: 'underline' }}
						>
							{label}
						</NextLink>
					</Typography>
				))}
			</Box>
		</Box>
	);
};
