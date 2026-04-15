import { getPageProps } from 'shared/utils/pagePropsUtils';
import { Banners } from 'shared/ui/Banners';
import { Box, Typography } from '@mui/material';
import { Benefits } from 'widgets/benefits';
import { sparePartApi } from 'entities/sparePart';
import { kindSparePartApi } from 'entities/kindSparePart';
import type { KindSparePartWithSparePartsCount } from 'entities/kindSparePart';
import { useQuery } from '@tanstack/react-query';
import { ChevronRightIcon } from 'shared/icons/ChevronRightIcon';
import { useState } from 'react';

interface Props {
	sparePartsTotal: number;
}

export default function MobileCatalog({ sparePartsTotal }: Props) {
	const [selectedCategory, setSelectedCategory] = useState<KindSparePartWithSparePartsCount | null>(null);

	const { data: kindSpareParts } = useQuery({
		queryKey: ['catalogCategories', selectedCategory?.id],
		enabled: true,
		placeholderData: (prev) => prev,
		queryFn: () =>
			kindSparePartApi.fetchKindSpareParts<KindSparePartWithSparePartsCount>({
				pagination: { limit: 15, start: selectedCategory ? Math.floor(Math.random() * 100) : 0 },
				populate: { spareParts: { count: true } }
			})
	});

	const handleCategoryClick = (item: KindSparePartWithSparePartsCount) => () => {
		setSelectedCategory(item);
	};

	return (
        <Box
            sx={{
                bgcolor: 'white',
                ml: -2,
                mr: -2,
                py: 2,
                pl: 2
            }}>
            <Benefits view='carousel' />
            <Box
                sx={{
                    mt: 2,
                    pr: 2
                }}>
				<Box sx={{
                    mb: 2
                }}>
					{kindSpareParts?.data.data.map((item) => (
						<Box
                            key={item.id}
                            onClick={handleCategoryClick(item)}
                            sx={{
                                px: 1,
                                py: 1,
                                borderRadius: 2,
                                display: 'flex',
                                gap: 0.5,
                                alignItems: 'center',
                                cursor: 'pointer',
                                ':hover': { bgcolor: 'custom.bg-surface-3' }
                            }}>
							<Typography variant='body1' sx={{
                                fontWeight: 500
                            }}>
								{item.name}
							</Typography>
							<Typography
                                variant='body1'
                                sx={{
                                    flex: 1,
                                    color: 'custom.text-muted'
                                }}>
								{item.spareParts.count?.toLocaleString()}
							</Typography>
							<Box>
								<ChevronRightIcon></ChevronRightIcon>
							</Box>
						</Box>
					))}
				</Box>
				<Banners images={[]} />
			</Box>
        </Box>
    );
}

export const getServerSideProps = getPageProps(undefined, async (context, deviceTypeResult) => {
	if (deviceTypeResult === 'desktop') {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}

	const { data } = await sparePartApi.fetchSpareParts({
		pagination: { limit: 0 },
		filters: {
			sold: false
		}
	});

	const sparePartsTotal = data.meta?.pagination?.total ?? 0;

	return {
		props: {
			sparePartsTotal
		}
	};
});
