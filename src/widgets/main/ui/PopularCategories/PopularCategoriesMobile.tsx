import { Box } from '@mui/material';
import { Typography, WhiteBox, Image } from 'shared/ui';
import type { PopularCategoryItem } from '../../popularCategoriesTypes';

interface PopularCategoriesMobileProps {
	categories: PopularCategoryItem[];
}

export const PopularCategoriesMobile: React.FC<PopularCategoriesMobileProps> = ({ categories }) => (
	<Box sx={{ display: { xs: 'flex', md: 'none' }, flexWrap: 'wrap', gap: 1.5, mb: 5 }}>
		{categories.map((cat, i) => (
			<Box
                key={i}
                sx={{
                    overflow: 'hidden',
                    width: 'calc(50% - 6px)',
                    minWidth: 0
                }}>
				<WhiteBox
					withShadow
					sx={{ p: 1.5, height: '100%', minHeight: 88, position: 'relative' }}>
					<Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            gap: 1,
                            height: '100%'
                        }}>
						<Box
                            sx={{
                                flexShrink: 0,
                                width: 70,
                                height: 70,
                                display: 'flex',
                                alignItems: 'center',
                                position: 'absolute',
                                top: '-20px',
                                left: '-20px',
                                justifyContent: 'center',
                                borderRadius: 1
                            }}>
							<Image
								isOnSSR={false}
								src={cat.image}
								alt={cat.title}
								style={{ objectFit: 'contain' }}
								width={70}
								height={70}
							/>
						</Box>
						<Box
                            sx={{
                                minWidth: 0,
                                flex: 1,
                                pt: 0.25,
                                textAlign: 'center'
                            }}>
							<Typography variant='body2' sx={{ fontWeight: 600, lineHeight: 1.3 }}>
								{cat.title}
							</Typography>
							<Typography color='custom.text-muted' variant='caption' sx={{ display: 'block', lineHeight: 1.3 }}>
								{cat.subtitle}
							</Typography>
						</Box>
					</Box>
				</WhiteBox>
			</Box>
		))}
	</Box>
);
