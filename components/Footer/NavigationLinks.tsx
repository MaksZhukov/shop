import { Theme, Typography } from '@mui/material';
import NextLink from 'next/link';
import { FC } from 'react';

interface NavigationLinksProps {
	links: ReadonlyArray<{ readonly href: string; readonly label: string }>;
	theme: Theme;
}

const NavigationLinks: FC<NavigationLinksProps> = ({ links, theme }) => (
	<>
		{links.map(({ href, label }) => (
			<Typography key={href} color={theme.palette.custom['text-inverse']} mb={1}>
				<NextLink href={href}>{label}</NextLink>
			</Typography>
		))}
	</>
);

export default NavigationLinks;
