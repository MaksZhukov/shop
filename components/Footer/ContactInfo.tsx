import { Box, Link, Theme, Typography } from '@mui/material';
import { FC } from 'react';
import { CONTACT_INFO } from './constants';

interface ContactInfoProps {
	theme: Theme;
}

const ContactInfo: FC<ContactInfoProps> = ({ theme }) => (
	<Box textAlign={{ xs: 'center', md: 'left' }} mb={1}>
		{CONTACT_INFO.phones.map((phone) => (
			<Typography key={phone.number} mb={1}>
				<Link
					href={`tel:${phone.number}`}
					underline='none'
					color={theme.palette.custom['text-inverse']}
					aria-label={`Позвонить по номеру ${phone.label}`}
				>
					{phone.label}
				</Link>
			</Typography>
		))}
		<Typography mb={2}>
			<Link
				href={`mailto:${CONTACT_INFO.email}`}
				underline='none'
				color={theme.palette.custom['text-inverse']}
				aria-label={`Написать на email ${CONTACT_INFO.email}`}
			>
				{CONTACT_INFO.email}
			</Link>
		</Typography>
		{CONTACT_INFO.workingHours.map((hours, index) => (
			<Typography key={index} mb={1} color={theme.palette.custom['text-muted']}>
				{hours}
			</Typography>
		))}
	</Box>
);

export default ContactInfo;
