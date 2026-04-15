import { Box, Link, Typography } from '@mui/material';
import { FC } from 'react';
import { CONTACT_INFO } from '../footerConstants';

const ContactInfo: FC = () => (
	<Box
        sx={{
            textAlign: { xs: 'center', md: 'left' },
            mb: 1
        }}>
		{CONTACT_INFO.phones.map((phone) => (
			<Typography key={phone.number} sx={{
                mb: 1
            }}>
				<Link
					href={`tel:${phone.number}`}
					underline='none'
					sx={{ color: 'custom.text-inverse' }}
					aria-label={`Позвонить по номеру ${phone.label}`}
				>
					{phone.label}
				</Link>
			</Typography>
		))}
		<Typography sx={{
            mb: 2
        }}>
			<Link
				href={`mailto:${CONTACT_INFO.email}`}
				underline='none'
				sx={{ color: 'custom.text-inverse' }}
				aria-label={`Написать на email ${CONTACT_INFO.email}`}
			>
				{CONTACT_INFO.email}
			</Link>
		</Typography>
		{CONTACT_INFO.workingHours.map((hours, index) => (
			<Typography key={index} sx={{ mb: 1, color: 'custom.text-muted' }}>
				{hours}
			</Typography>
		))}
	</Box>
);

export default ContactInfo;
