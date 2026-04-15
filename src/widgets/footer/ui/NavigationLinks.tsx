import { Typography } from '@mui/material';
import { Link } from 'shared/ui';
import { FC, HTMLAttributeAnchorTarget } from 'react';

interface NavigationLinksProps {
	links: ReadonlyArray<{
		readonly href: string;
		readonly label: string;
		readonly target?: HTMLAttributeAnchorTarget;
	}>;
}

const NavigationLinks: FC<NavigationLinksProps> = ({ links }) => (
	<>
		{links.map(({ href, label, target }) => (
			<Typography key={href} sx={{ mb: 1, color: 'custom.text-inverse' }}>
				<Link href={href} target={target} sx={{ color: 'custom.text-inverse' }}>
					{label}
				</Link>
			</Typography>
		))}
	</>
);

export default NavigationLinks;
