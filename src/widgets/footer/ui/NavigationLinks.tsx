import { Box, Typography } from '@mui/material';
import { FC, HTMLAttributeAnchorTarget } from 'react';
import { Link } from 'shared/ui';

interface NavigationLinksProps {
	links: ReadonlyArray<{
		readonly href: string;
		readonly label: string;
		readonly target?: HTMLAttributeAnchorTarget;
	}>;
}

export const NavigationLinks: FC<NavigationLinksProps> = ({ links }) => (
	<Box component='nav' sx={{ display: 'flex', flexDirection: 'column' }}>
		{links.map(({ href, label, target }) => (
			<Typography key={`${href}-${label}`} variant='body2' sx={{ py: { xs: 1, md: 1.5 }, lineHeight: 1.6 }}>
				<Link href={href} target={target} sx={{ color: 'text.primary', fontWeight: 400 }}>
					{label}
				</Link>
			</Typography>
		))}
	</Box>
);
