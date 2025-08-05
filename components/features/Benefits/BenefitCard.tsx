import { useTheme } from '@mui/material';
import { Typography, WhiteBox } from 'components/ui';
import { BenefitCardProps } from './types';

export const BenefitCard: React.FC<BenefitCardProps> = ({ item, sparePartsTotal, sx }) => {
	const theme = useTheme();

	const displayTitle = () => {
		if (item.formatter && sparePartsTotal !== undefined) {
			return item.formatter(sparePartsTotal);
		}
		return item.title;
	};

	return (
		<WhiteBox
			height={120}
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent='end'
			p={1.5}
			sx={sx}
		>
			<Typography variant='body1'>{displayTitle()}</Typography>
			<Typography variant='body2' color='custom.text-muted'>
				{item.subtitle}
			</Typography>
		</WhiteBox>
	);
};
