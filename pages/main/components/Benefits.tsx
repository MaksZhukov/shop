import { Box, useTheme } from '@mui/material';
import Typography from 'components/ui/Typography';
import WhiteBox from 'components/ui/WhiteBox';
import { formatNumberWithSeparators } from 'services/NumberService';

interface BenefitsProps {
	sparePartsTotal: number;
}

export const Benefits: React.FC<BenefitsProps> = ({ sparePartsTotal }) => {
	const theme = useTheme();

	return (
		<Box mb={5} display={'flex'} gap={1} flexWrap={'wrap'}>
			<WhiteBox
				height={120}
				display={'flex'}
				justifyContent={'end'}
				flexDirection={'column'}
				alignItems={'center'}
				p={1.5}
				flex={{ xs: `calc(50% - ${theme.spacing(1)})`, md: '1' }}
			>
				<Typography>Автозапчасти</Typography>
				<Typography color='custom.text-muted'>Без пробега по РБ</Typography>
			</WhiteBox>
			<WhiteBox
				height={120}
				display={'flex'}
				flexDirection={'column'}
				alignItems={'center'}
				justifyContent='end'
				p={1.5}
				flex={{ xs: `calc(50% - ${theme.spacing(1)})`, md: '1' }}
			>
				<Typography variant='body1'>Доставка</Typography>
				<Typography variant='body2' color='custom.text-muted'>
					Во все регионы РБ
				</Typography>
			</WhiteBox>
			<WhiteBox
				height={120}
				display={'flex'}
				flexDirection={'column'}
				alignItems={'center'}
				justifyContent={'end'}
				p={1.5}
				flex={{ xs: `calc(50% - ${theme.spacing(1)})`, md: '1' }}
			>
				<Typography variant='body1'>Гарантия</Typography>
				<Typography variant='body2' color='custom.text-muted'>
					На весь ассортимент
				</Typography>
			</WhiteBox>
			<WhiteBox
				height={120}
				display={'flex'}
				flexDirection={'column'}
				justifyContent={'end'}
				alignItems={'center'}
				p={1.5}
				flex={{ xs: `calc(50% - ${theme.spacing(1)})`, md: '1' }}
			>
				<Typography variant='body1'>{formatNumberWithSeparators(sparePartsTotal)} запчастей</Typography>
				<Typography variant='body2' color='custom.text-muted'>
					В наличии на складе
				</Typography>
			</WhiteBox>
		</Box>
	);
};
