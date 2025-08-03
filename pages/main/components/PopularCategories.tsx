import { Box } from '@mui/material';
import Typography from 'components/ui/Typography';
import WhiteBox from 'components/ui/WhiteBox';

export const PopularCategories: React.FC = () => {
	return (
		<>
			<Box textAlign={{ xs: 'center', md: 'left' }} mb={1}>
				<Typography variant='h6'>Популярные категории</Typography>
				<Typography color='text.primary' variant='body2'>
					Все запчасти, представленные в каталоге, находятся на складе и готовы к оперативной отправке
				</Typography>
			</Box>
			<Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} mb={5} gap={1}>
				<Box display='flex' flex='1' flexDirection={{ xs: 'row', md: 'column' }} gap={1} flexWrap={'wrap'}>
					<WhiteBox
						p={2}
						height={{ xs: 120, md: 200 }}
						display='flex'
						flex='1'
						flexDirection='column'
						justifyContent='end'
						alignItems='center'
					>
						<Typography variant='body1' fontWeight='600'>
							Автозапчасти
						</Typography>
						<Typography color='custom.text-muted' variant='body2'>
							Без пробега по РБ
						</Typography>
					</WhiteBox>
					<WhiteBox
						p={2}
						height={{ xs: 120, md: 200 }}
						display='flex'
						flex='1'
						flexDirection='column'
						justifyContent='end'
						alignItems='center'
					>
						<Typography variant='body1' fontWeight='600'>
							Автозапчасти
						</Typography>
						<Typography color='custom.text-muted' variant='body2'>
							Без пробега по РБ
						</Typography>
					</WhiteBox>
				</Box>

				{/* Column 2 - 1 WhiteBox */}
				<Box display='flex' flex='1' flexDirection={{ xs: 'row', md: 'column' }} gap={1} flexWrap={'wrap'}>
					<WhiteBox
						p={2}
						height={{ xs: 120, md: 416 }}
						display='flex'
						flex='1'
						flexDirection='column'
						justifyContent='end'
						alignItems='center'
					>
						<Typography variant='body1' fontWeight='600'>
							Автозапчасти
						</Typography>
						<Typography color='custom.text-muted' variant='body2'>
							Без пробега по РБ
						</Typography>
					</WhiteBox>
				</Box>

				{/* Column 3 - 2 WhiteBox */}
				<Box display='flex' flex='1' flexDirection={{ xs: 'row', md: 'column' }} gap={1} flexWrap={'wrap'}>
					<WhiteBox
						p={2}
						height={{ xs: 120, md: 200 }}
						display='flex'
						flex='1'
						flexDirection='column'
						justifyContent='end'
						alignItems='center'
					>
						<Typography variant='body1' fontWeight='600'>
							Автозапчасти
						</Typography>
						<Typography color='custom.text-muted' variant='body2'>
							Без пробега по РБ
						</Typography>
					</WhiteBox>
					<WhiteBox
						p={2}
						height={{ xs: 120, md: 200 }}
						display='flex'
						flex='1'
						flexDirection='column'
						justifyContent='end'
						alignItems='center'
					>
						<Typography variant='body1' fontWeight='600'>
							Автозапчасти
						</Typography>
						<Typography color='custom.text-muted' variant='body2'>
							Без пробега по РБ
						</Typography>
					</WhiteBox>
				</Box>

				{/* Column 4 - 1 WhiteBox */}
				<Box display='flex' flex='1' flexDirection={{ xs: 'row', md: 'column' }} gap={1} flexWrap={'wrap'}>
					<WhiteBox
						p={2}
						height={{ xs: 120, md: 416 }}
						display='flex'
						flex='1'
						flexDirection='column'
						justifyContent='end'
						alignItems='center'
					>
						<Typography variant='body1' fontWeight='600'>
							Автозапчасти
						</Typography>
						<Typography color='custom.text-muted' variant='body2'>
							Без пробега по РБ
						</Typography>
					</WhiteBox>
				</Box>
			</Box>
		</>
	);
};
