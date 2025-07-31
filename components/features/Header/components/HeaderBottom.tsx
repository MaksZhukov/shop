import { Box, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'components/ui';
import { WorkTimetable } from 'components/features/WorkTimetable';
import Image from 'components/Image';

interface HeaderBottomProps {
	isScrolled: boolean;
}

export const HeaderBottom: React.FC<HeaderBottomProps> = ({ isScrolled }) => {
	console.log(isScrolled);
	return (
		<Box
			color={'text.primary'}
			justifyContent='space-between'
			flexWrap='wrap'
			gap={1}
			sx={{
				display: { xs: 'none', sm: isScrolled ? 'none' : 'flex' },
				transition: 'opacity 0.3s ease-in-out',
				opacity: isScrolled ? 0 : 1,
				height: isScrolled ? 0 : 'auto',
				overflow: 'hidden'
			}}
		>
			<Box display={'flex'} gap={2}>
				<Link href='/spare-parts?kindSparePart=dvigatel'>Двигатели</Link>
				<Link href='/spare-parts?kindSparePart=kpp-avtomaticheskaya-akpp'>Коробки АКПП</Link>
				<Link href='/spare-parts?kindSparePart=kpp-mehanicheskaya-mkpp'>МКПП</Link>
				<Link href='/tires'>Шины</Link>
				<Link href='/wheels'>Диски</Link>
				<Link href='/delivery'>Доставка и оплата</Link>
				<Link href='/contacts'>Контакты</Link>
			</Box>
			<Box display={'flex'} gap={2} alignItems='center'>
				<WorkTimetable />
				<Typography display={'flex'} alignItems='center' gap={1}>
					<Image isOnSSR={false} src='/mts_icon.png' alt='phone' quality={100} width={20} height={20} />{' '}
					<Link href='tel:+375297804780'>+375297804780</Link>
				</Typography>
				<Typography display={'flex'} alignItems='center' gap={1}>
					<Image isOnSSR={false} src='/a1_icon.png' alt='phone' quality={100} width={24} height={24} />{' '}
					<Link href='tel:+375296011602'>+375296011602</Link>
				</Typography>
			</Box>
		</Box>
	);
};
