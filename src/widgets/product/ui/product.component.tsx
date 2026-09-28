import { Box } from '@mui/material';
import type {
	PageProduct,
	PageProductCabin,
	PageProductSparePart,
	PageProductTire,
	PageProductWheel
} from 'entities/page';
import type { Product as IProduct } from 'entities/product';
import { GalleryImages } from 'shared/ui/GalleryImages';
import { FC, useEffect, useState } from 'react';
import { productViewedLocalStorage } from 'entities/product';
import { ProductImages } from './ProductImages';
import { ProductInfo } from './ProductInfo';
import { ProductTabs } from './ProductTabs';
import { RelatedProducts } from './RelatedProducts';
import { MobileCartButton } from './MobileCartButton';
import { ProductContent } from './ProductContent';

interface Props {
	page: PageProduct & (PageProductCabin | PageProductSparePart | PageProductTire | PageProductWheel);
	data: IProduct;
	relatedProducts: IProduct[];
}

const Product: FC<Props> = ({ data, page, relatedProducts }) => {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	useEffect(() => {
		if (data.type === 'sparePart' || data.type === 'tire' || data.type === 'wheel') {
			productViewedLocalStorage.addViewedProduct({ id: data.id, type: data.type });
		}
	}, [data.id, data.type]);

	const handleImageClick = (index: number) => {
		setSelectedImageIndex(index);
	};

	const handleImageSelect = (index: number) => {
		setCurrentImageIndex(index);
	};

	const handleCloseGallery = () => {
		setSelectedImageIndex(null);
	};

	return (
        <Box
            sx={{
                bgcolor: { xs: '#fff', md: 'transparent' },
                ml: { xs: -2, md: 0 },
                pl: { xs: 1, md: 0 },
                pr: { xs: 1, md: 0 },
                width: { xs: 'calc(100% + 2em)', md: '100%' }
            }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 1,
                    mb: 4
                }}>
				<Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        flex: 1,
                        gap: 1
                    }}>
					<ProductImages
						images={data.images}
						currentImageIndex={currentImageIndex}
						onImageClick={handleImageClick}
						onImageSelect={handleImageSelect}
					/>
				</Box>

				<Box sx={{
                    flex: 1
                }}>
					<ProductInfo product={data} />
					<ProductTabs product={data} />
				</Box>
			</Box>
            <RelatedProducts product={data} relatedProducts={relatedProducts} />
            <ProductContent page={page} />
            <GalleryImages images={data.images} selectedIndex={selectedImageIndex} onClose={handleCloseGallery} />
            <MobileCartButton product={data} />
        </Box>
    );
};

export default Product;
