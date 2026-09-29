import { Box, Typography } from '@mui/material';
import { reatomComponent } from '@reatom/react';
import { ChevronRightIcon } from 'shared/icons';
import { Link } from 'shared/ui';
import { useDI } from '../../header.di';

export const CatalogMenuContent = reatomComponent(() => {
	const { headerCatalogStore } = useDI();
	const topCategories = headerCatalogStore.topCategories.data();
	const activeCategory = headerCatalogStore.activeCategory();

	return (
		<Box sx={{ bgcolor: 'background.paper', minHeight: '900px', display: 'flex', p: 2 }}>
			<Box sx={{ width: '256px', p: 1, display: 'flex', flexDirection: 'column' }}>
				<Typography variant='h6' sx={{ fontWeight: 700 }}>
					Каталог
				</Typography>
				{topCategories.map((category) => (
					<Box
						key={category.name}
						onMouseEnter={() => headerCatalogStore.hoverCategory(category)}
						sx={{
							bgcolor: activeCategory === category ? 'custom.bg-surface-3' : 'transparent',
							p: 1,
							borderRadius: 2,
							display: 'flex',
							gap: 0.5,
							alignItems: 'center',
							cursor: 'pointer',
							':hover': { bgcolor: 'custom.bg-surface-3' }
						}}
					>
						<Typography variant='body1' sx={{ fontWeight: 500 }}>
							{category.name}
						</Typography>
						<Typography variant='body1' color='custom.text-muted' sx={{ flex: 1 }}>
							{category.totalSparePartsCount?.toLocaleString()}
						</Typography>
						<Box>
							<ChevronRightIcon />
						</Box>
					</Box>
				))}
			</Box>
			<Box sx={{ minWidth: '1000px', maxHeight: '500px', borderRadius: 4, bgcolor: 'custom.bg-surface-1', p: 2 }}>
				<Typography variant='h6' sx={{ fontWeight: 700 }}>
					{activeCategory?.name}
				</Typography>
				<Box
					sx={{
						maxHeight: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-start',
						flexWrap: 'wrap'
					}}
				>
					{activeCategory?.kindSpareParts.map((item) => (
						<Box
							key={item.id}
							onClick={() => headerCatalogStore.closeMenu()}
							sx={{ display: 'flex', gap: 0.5, py: 1 }}
						>
							<Link href={`/spare-parts/ksp-${item.slug}`}>{item.name}</Link>
							<Typography variant='body2' color='custom.text-muted'>
								{item.spareParts.count?.toLocaleString()}
							</Typography>
						</Box>
					))}
				</Box>
			</Box>
		</Box>
	);
});
