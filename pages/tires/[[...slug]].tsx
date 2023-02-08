import type { NextPage } from 'next';
import { SEO } from 'api/types';
import { API_MAX_LIMIT } from 'api/constants';
import { fetchTire, fetchTires } from 'api/tires/tires';
import { fetchTireBrandBySlug, fetchTireBrands } from 'api/tireBrands/tireBrands';
import { getPageProps } from 'services/PagePropsService';
import { TireBrand } from 'api/tireBrands/types';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageProduct, PageProductTire } from 'api/pages/types';
import CatalogTires from 'components/CatalogTires';
import { getProductPageSeo } from 'services/ProductService';
import Product from 'components/Product';
import { Tire } from 'api/tires/types';

interface Props {
    data?: Tire;
    relatedProducts?: Tire[];
    page: DefaultPage | (PageProduct & PageProductTire);
    tireBrands: TireBrand[];
}

const Tires: NextPage<Props> = ({ page, tireBrands, data, relatedProducts }) => {
    if (data && relatedProducts) {
        return (
            <Product
                data={data}
                printOptions={[
                    { text: 'Артикул', value: data.id },
                    { text: 'Количество', value: data.count },
                    { text: 'Марка', value: data.brand?.name },
                    { text: 'Диаметр', value: data.diameter?.name },
                    { text: 'Высота', value: data.height?.name },
                    { text: 'Ширина', value: data.width?.name },
                    { text: 'Сезон', value: data.season },
                    { text: 'Описание', value: data.description }
                ]}
                page={page as PageProduct & PageProductTire}
                relatedProducts={relatedProducts}></Product>
        );
    }
    return <CatalogTires page={page} tireBrands={tireBrands}></CatalogTires>;
};

export default Tires;

export const getServerSideProps = getPageProps(undefined, async (context) => {
    const { slug } = context.query;
    let tireBrands: TireBrand[] = [];
    const brandParam = slug ? slug[0] : undefined;
    const productSlugParam = slug ? slug[1] : undefined;
    let seo: SEO | null = null;
    let props: any = {};
    if (productSlugParam) {
        const [
            {
                data: { data }
            },
            {
                data: { data: page }
            },
            {
                data: { data: pageTire }
            }
        ] = await Promise.all([
            fetchTire(productSlugParam),
            fetchPage<PageProduct>('product', { populate: ['linksWithImages.image', 'benefits'] })(),
            fetchPage<PageProductTire>('product-tire', { populate: ['seo'] })()
        ]);
        const {
            data: { data: relatedProducts }
        } = await fetchTires({
            filters: {
                price: { $gt: 0 },
                id: {
                    $ne: data.id
                },
                brand: data.brand?.id
            },
            populate: ['images', 'brand']
        });
        props = {
            data,
            page: {
                ...page,
                ...pageTire,
                seo: getProductPageSeo(pageTire.seo, data)
            },
            relatedProducts
        };
    } else if (brandParam) {
        const [
            {
                data: { data }
            },
            {
                data: { data: tireBrandsData }
            }
        ] = await Promise.all([
            fetchTireBrandBySlug(brandParam, { populate: ['seo.images', 'image'] }),
            fetchTireBrands({
                pagination: { limit: API_MAX_LIMIT }
            })
        ]);
        props = { seo: data.seo, tireBrands: tireBrandsData };
    } else {
        const {
            data: { data }
        } = await fetchPage('tire')();
        props = { page: { seo: data.seo }, tireBrands: [] };
    }
    return props;
});
