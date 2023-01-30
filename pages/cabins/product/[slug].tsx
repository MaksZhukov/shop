import { fetchCabin, fetchCabins } from 'api/cabins/cabins';
import { Cabin } from 'api/cabins/types';
import { fetchPage } from 'api/pages';
import { PageProduct, PageProductCabin } from 'api/pages/types';
import Product from 'components/Product';
import { getPageProps } from 'services/PagePropsService';
import { getProductPageSeo } from 'services/ProductService';

interface Props {
    data: Cabin;
    page: PageProduct & PageProductCabin;
    relatedProducts: Cabin[];
}

const CabinPage = ({ data, page, relatedProducts }: Props) => {
    return (
        <Product
            data={data}
            printOptions={[
                { text: 'Артикул', value: data.id },
                { text: 'Марка', value: data.brand?.name },
                { text: 'Модель', value: data.model?.name },
                { text: 'Поколение', value: data.generation?.name },
                { text: 'Год', value: data.year },
                { text: 'Запчасть', value: data.kindSparePart?.name },
                ...(data.seatUpholstery ? [{ text: 'Обивка сидений', value: data.seatUpholstery }] : [])
            ]}
            page={page}
            relatedProducts={relatedProducts}></Product>
    );
};

export const getServerSideProps = getPageProps(undefined, async (context) => {
    const [
        {
            data: { data }
        },
        {
            data: { data: page }
        },
        {
            data: { data: pageCabin }
        }
    ] = await Promise.all([
        fetchCabin(context.params?.slug || ''),
        fetchPage<PageProduct>('product', { populate: ['linksWithImages.image', 'benefits'] })(),
        fetchPage<PageProductCabin>('product-cabin', { populate: ['seo'] })()
    ]);
    const {
        data: { data: relatedProducts }
    } = await fetchCabins({
        filters: {
            price: { $gt: 0 },
            id: {
                $ne: data.id
            },
            model: data.model?.id || ''
        },
        populate: ['images', 'brand']
    });
    return {
        data,
        page: {
            ...page,
            ...pageCabin,
            seo: getProductPageSeo(pageCabin.seo, data)
        },
        relatedProducts
    };
});

export default CabinPage;
