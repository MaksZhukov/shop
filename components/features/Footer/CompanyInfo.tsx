import { Typography } from '@mui/material';
import { FC } from 'react';
import { COMPANY_INFO } from './constants';

interface CompanyInfoProps {
	showOnMobile: boolean;
	theme: any;
}

const CompanyInfo: FC<CompanyInfoProps> = ({ showOnMobile, theme }) => (
	<>
		<Typography
			mb={1}
			color={theme.palette.custom['text-muted']}
			sx={{ display: { xs: showOnMobile ? 'block' : 'none', md: showOnMobile ? 'none' : 'block' } }}
		>
			{COMPANY_INFO.name}
		</Typography>
		<Typography
			mb={1}
			color={theme.palette.custom['text-muted']}
			sx={{ display: { xs: showOnMobile ? 'block' : 'none', md: showOnMobile ? 'none' : 'block' } }}
		>
			{COMPANY_INFO.unp}
		</Typography>
	</>
);

export default CompanyInfo;
