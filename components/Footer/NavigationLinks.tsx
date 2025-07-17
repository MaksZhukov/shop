import { Theme, Typography } from '@mui/material';
import { Link } from 'components/ui';
import NextLink from 'next/link';
import { FC, HTMLAttributeAnchorTarget } from 'react';

interface NavigationLinksProps {
	links: ReadonlyArray<{
		readonly href: string;
		readonly label: string;
		readonly target?: HTMLAttributeAnchorTarget;
	}>;
	theme: Theme;
}

const NavigationLinks: FC<NavigationLinksProps> = ({ links, theme }) => (
	<>
		{links.map(({ href, label, target }) => (
			<Typography key={href} color={theme.palette.custom['text-inverse']} mb={1}>
				<Link href={href} target={target} color={theme.palette.custom['text-inverse']}>
					{label}
				</Link>
			</Typography>
		))}
	</>
);

export default NavigationLinks;
