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
	total: number | null;
	onClickFind: () => void;
	onChangeFilterValues: (values: { [key: string]: string | null }) => void;
	catalogCategories: TopCategory[];
	hoveredCategory: TopCategory | null;
	onChangeHoveredCategory: (category: TopCategory | null) => void;
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
		<Box display={{ xs: 'none', md: 'block' }} width={256} component='aside'>
			<WhiteBox p={2} withShadow>
				<Filters
					total={total}
					config={filtersConfig}
					onClickFind={onClickFind}
					values={filtersValues}
					onChangeFilterValues={onChangeFilterValues}
				/>
			</WhiteBox>
			{catalogCategories.length > 0 && (
				<WhiteBox mt={2} p={1} withShadow sx={{ position: 'relative' }}>
					<Typography pl={1} variant='h6' fontWeight={700} fontSize={18}>
						Категории
					</Typography>
					{catalogCategories.map((category) => (
						<Box key={category.name}>
							<Box
								bgcolor={hoveredCategory === category ? 'custom.bg-surface-3' : 'transparent'}
								position='relative'
								sx={{ cursor: 'pointer', ':hover': { bgcolor: 'custom.bg-surface-3' } }}
								p={1}
								borderRadius={2}
								display='flex'
								gap={0.5}
								alignItems='center'
								onMouseLeave={() => {
									onChangeHoveredCategory(null);
								}}
								onMouseEnter={() => {
									onChangeHoveredCategory(category);
								}}
							>
								<Typography variant='body1' fontWeight={500}>
									{category.name}
								</Typography>
								<Typography flex={1} variant='body1' color='custom.text-muted'>
									{category.totalSparePartsCount?.toLocaleString()}
								</Typography>
								<Box>
									<ChevronRightIcon />
								</Box>
								{hoveredCategory === category && category.kindSpareParts.length > 0 && (
									<Box position='absolute' zIndex={1} top={0} left='100%' pl={1.5}>
										<WhiteBox minWidth={256} p={1} withShadow>
											{category.kindSpareParts.map((kindSparePart) => (
												<Box
													key={kindSparePart.id}
													sx={{
														cursor: 'pointer',
														':hover': { bgcolor: 'custom.bg-surface-3' },
														borderRadius: 2
													}}
													p={1}
												>
													<Box display='flex' gap={0.5} alignItems='center'>
														<Link href={`/spare-parts?kindSparePart=${kindSparePart.slug}`}>
															<Typography variant='body2' fontWeight={500}>
																{kindSparePart.name}
															</Typography>
														</Link>
														<Typography flex={1} variant='body2' color='custom.text-muted'>
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
