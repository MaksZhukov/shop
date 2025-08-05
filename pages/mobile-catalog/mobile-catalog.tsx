import { getPageProps } from 'services/PagePropsService';
import { Banners } from 'components/features/Banners';
import { Box, Typography } from '@mui/material';
import { Benefits } from 'components/features/Benefits';
import { fetchSpareParts } from 'api/spareParts/spareParts';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePartWithSparePartsCount } from 'api/kindSpareParts/types';
import { useQuery } from '@tanstack/react-query';
import { ChevronRightIcon } from 'components/icons/ChevronRightIcon';
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
			fetchKindSpareParts<KindSparePartWithSparePartsCount>({
				pagination: { limit: 15, start: selectedCategory ? Math.floor(Math.random() * 100) : 0 },
				populate: { spareParts: { count: true } }
			})
	});

	const handleCategoryClick = (item: KindSparePartWithSparePartsCount) => () => {
		setSelectedCategory(item);
	};

	return (
		<Box bgcolor='white' ml={-2} mr={-2} py={2} pl={2}>
			<Benefits sparePartsTotal={sparePartsTotal} view='carousel' />
			<Box mt={2} pr={2}>
				<Box mb={2}>
					{kindSpareParts?.data.data.map((item) => (
						<Box
							sx={{ cursor: 'pointer', ':hover': { bgcolor: '#E2E2E2' } }}
							px={1}
							py={1}
							borderRadius={2}
							key={item.id}
							display='flex'
							gap={0.5}
							alignItems='center'
							onClick={handleCategoryClick(item)}
						>
							<Typography variant='body1' fontWeight={500}>
								{item.name}
							</Typography>
							<Typography flex={1} variant='body1' color='custom.text-muted'>
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
	// if (deviceTypeResult === 'desktop') {
	// 	return {
	// 		redirect: {
	// 			destination: '/',
	// 			permanent: false
	// 		}
	// 	};
	// }

	const { data } = await fetchSpareParts({
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
