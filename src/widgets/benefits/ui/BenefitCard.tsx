import { Image, Typography, WhiteBox } from 'shared/ui';
import type { BenefitCardProps } from '../benefitsTypes';

export const BenefitCard: React.FC<BenefitCardProps> = ({ item, sparePartsTotal, sx }) => {
	const displayTitle = () => {
		if (item.formatter && sparePartsTotal !== undefined) {
			return item.formatter(sparePartsTotal);
		}
		return item.title;
	};

	return (
		<WhiteBox
			height={120}
			position='relative'
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent='end'
			p={1}
			sx={sx}
		>
			<Image
				src={item.image}
				alt={item.title}
				width={178}
				isOnSSR={false}
				height={120}
				style={{
					position: 'absolute',
					top: 0
				}}
			/>
			<Typography variant='body1'>{displayTitle()}</Typography>
			<Typography variant='body2' color='custom.text-muted'>
				{item.subtitle}
			</Typography>
		</WhiteBox>
	);
};
