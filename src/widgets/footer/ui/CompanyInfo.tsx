import { Typography } from '@mui/material';
import { FC } from 'react';
import { COMPANY_INFO } from '../footerConstants';

interface CompanyInfoProps {
	showOnMobile: boolean;
}

const CompanyInfo: FC<CompanyInfoProps> = ({ showOnMobile }) => (
	<>
		<Typography
			sx={{
				mb: 1,
				color: 'custom.text-muted',
				display: { xs: showOnMobile ? 'block' : 'none', md: showOnMobile ? 'none' : 'block' }
			}}>
			{COMPANY_INFO.name}
		</Typography>
		<Typography
			sx={{
				mb: 1,
				color: 'custom.text-muted',
				display: { xs: showOnMobile ? 'block' : 'none', md: showOnMobile ? 'none' : 'block' }
			}}>
			{COMPANY_INFO.unp}
		</Typography>
	</>
);

export default CompanyInfo;
