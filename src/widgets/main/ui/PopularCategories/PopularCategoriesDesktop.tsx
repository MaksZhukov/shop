import { Box } from '@mui/material';
import { Typography, WhiteBox, Image } from 'shared/ui';
import type { PopularCategoryItem } from '../../popularCategoriesTypes';

interface PopularCategoriesDesktopProps {
	categories: PopularCategoryItem[];
	cardLayout: number[][];
}

export const PopularCategoriesDesktop: React.FC<PopularCategoriesDesktopProps> = ({
	categories,
	cardLayout
}) => (
	<Box display={{ xs: 'none', md: 'flex' }} flexDirection='row' mb={5} gap={1} flexWrap='wrap'>
		{cardLayout.map((indices, colIndex) => (
			<Box key={colIndex} display='flex' flex='1' flexDirection='column' gap={1} flexWrap='wrap'>
				{indices.map((i) => {
					const cat = categories[i];
					const isTall = indices.length === 1;
					return (
						<WhiteBox
							key={i}
							p={2}
							height={isTall ? 416 : 200}
							display='flex'
							flex='1'
							flexDirection='column'
							justifyContent='end'
							alignItems='center'
						>
							<Box
								flex={1}
								display='flex'
								alignItems='center'
								justifyContent='center'
								minHeight={0}
								width='100%'
							>
								<Image
									isOnSSR={false}
									src={cat.image}
									alt={cat.title}
									style={{ objectFit: 'contain' }}
									width={isTall ? 346 : 178}
									height={isTall ? 233 : 120}
								/>
							</Box>
							<Typography variant='body1' fontWeight='600'>
								{cat.title}
							</Typography>
							<Typography color='custom.text-muted' variant='body2'>
								{cat.subtitle}
							</Typography>
						</WhiteBox>
					);
				})}
			</Box>
		))}
	</Box>
);
