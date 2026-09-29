import { Link } from '@mui/material';
import NextLink from 'next/link';
import { PRIVACY_SITE_URL } from '../privacy.constants';

type PrivacySiteLinkProps = {
	href?: string;
	label?: string;
};

export const PrivacySiteLink = ({ href = '/', label = PRIVACY_SITE_URL }: PrivacySiteLinkProps) => (
	<NextLink href={href}>
		<Link component='span'>{label}</Link>
		{href === '/' && '.'}
	</NextLink>
);
