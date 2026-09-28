import { Box } from '@mui/material';
import { Filters, AutocompleteType, NumberType } from 'features/productFilters';
import { WhiteBox } from 'shared/ui';
import { Typography } from 'shared/ui';
import { TopCategory } from 'entities/catalog';
import { Link } from 'shared/ui';
import { ChevronRightIcon } from 'shared/icons';

interface CatalogSidebarProps {
	filtersConfig: (AutocompleteType | NumberType)[];
	filtersValues: { [key: string]: string | null };
	total?: number;
	onClickFind: () => void;
	onChangeFilterValues: (values: { [key: string]: string | null }) => void;
	catalogCategories: TopCategory[];
	hoveredCategory?: TopCategory | null;
	onChangeHoveredCategory?: (category: TopCategory | null) => void;
}

export const CatalogSidebar: React.FC<CatalogSidebarProps> = ({
	filtersConfig,
	filtersValues,
	total,
	onClickFind,
	onChangeFilterValues,
	catalogCategories,
	hoveredCategory,
	onChangeHoveredCategory
}) => {
	return (
        <Box
            component='aside'
            sx={{
                display: { xs: 'none', md: 'block' },
                width: 256
            }}>
			<WhiteBox withShadow sx={{ p: 2 }}>
				<Filters
					total={total}
					config={filtersConfig}
					onClickFind={onClickFind}
					values={filtersValues}
					onChangeFilterValues={onChangeFilterValues}
				/>
			</WhiteBox>
            {catalogCategories.length > 0 && (
				<WhiteBox withShadow sx={{ mt: 2, p: 1, position: 'relative' }}>
					<Typography variant='h6' sx={{ pl: 1, fontWeight: 700, fontSize: 18 }}>
						Категории
					</Typography>
					{catalogCategories.map((category) => (
						<Box key={category.name}>
							<Box
                                onMouseLeave={() => {
									onChangeHoveredCategory?.(null);
								}}
                                onMouseEnter={() => {
									onChangeHoveredCategory?.(category);
								}}
                                sx={{
                                    bgcolor: hoveredCategory === category ? 'custom.bg-surface-3' : 'transparent',
                                    position: 'relative',
                                    p: 1,
                                    borderRadius: 2,
                                    display: 'flex',
                                    gap: 0.5,
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    ':hover': { bgcolor: 'custom.bg-surface-3' }
                                }}>
								<Typography variant='body1' sx={{ fontWeight: 500 }}>
									{category.name}
								</Typography>
								<Typography variant='body1' color='custom.text-muted' sx={{ flex: 1 }}>
									{category.totalSparePartsCount?.toLocaleString()}
								</Typography>
								<Box>
									<ChevronRightIcon />
								</Box>
								{hoveredCategory === category && category.kindSpareParts.length > 0 && (
									<Box
                                        sx={{
                                            position: 'absolute',
                                            zIndex: 1,
                                            top: 0,
                                            left: '100%',
                                            pl: 1.5
                                        }}>
										<WhiteBox withShadow sx={{ minWidth: 256, p: 1 }}>
											{category.kindSpareParts.map((kindSparePart) => (
												<Box
                                                    key={kindSparePart.id}
                                                    sx={{
                                                        p: 1,
                                                        cursor: 'pointer',
                                                        ':hover': { bgcolor: 'custom.bg-surface-3' },
                                                        borderRadius: 2
                                                    }}>
													<Box
                                                        sx={{
                                                            display: 'flex',
                                                            gap: 0.5,
                                                            alignItems: 'center'
                                                        }}>
														<Link href={`/spare-parts/ksp-${kindSparePart.slug}`}>
															<Typography variant='body2' sx={{ fontWeight: 500 }}>
																{kindSparePart.name}
															</Typography>
														</Link>
														<Typography variant='body2' color='custom.text-muted' sx={{ flex: 1 }}>
															{kindSparePart.spareParts.count?.toLocaleString()}
														</Typography>
													</Box>
												</Box>
											))}
										</WhiteBox>
									</Box>
								)}
							</Box>
						</Box>
					))}
				</WhiteBox>
			)}
        </Box>
    );
};
