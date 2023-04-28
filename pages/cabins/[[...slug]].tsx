import type { NextPage } from 'next';
import { SEO } from 'api/types';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { Brand } from 'api/brands/types';
import { fetchModelBySlug } from 'api/models/models';
import { DefaultPage, PageProduct, PageProductCabin } from 'api/pages/types';
import { fetchBrandBySlug } from 'api/brands/brands';
import CatalogCabins from 'components/CatalogCabins';
import { getProductPageSeo } from 'services/ProductService';
import { fetchCabin, fetchCabins } from 'api/cabins/cabins';
import Product from 'components/Product';
import { Cabin } from 'api/cabins/types';
import { withKindSparePart } from 'services/SEOService';

interface Props {
    data: Cabin;
    relatedProducts: Cabin[];
    page: DefaultPage | (PageProduct & PageProductCabin);
    brands: Brand[];
}

const Cabins: NextPage<Props> = ({ page, brands, data, relatedProducts }) => {
    if (data) {
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
                    ...(data.seatUpholstery ? [{ text: 'Обивка сидений', value: data.seatUpholstery }] : []),
                    {
                        text: 'Описание',
                        value: data.description
                    }
                ]}
                page={page as PageProduct & PageProductCabin}
                relatedProducts={relatedProducts}></Product>
        );
    }
    return <CatalogCabins page={page} brands={brands}></CatalogCabins>;
};

export default Cabins;

export const getServerSideProps = getPageProps(undefined, async (context) => {
    const { slug = [], kindSparePart } = context.query;
    const [brand, modelOrProductParam] = slug;

    const productParam =
        modelOrProductParam && !modelOrProductParam.includes('model-') ? modelOrProductParam : undefined;
    const modelParam = modelOrProductParam && modelOrProductParam.includes('model-') ? modelOrProductParam : undefined;
    let props: any = {};
    if (productParam) {
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
            fetchCabin(productParam),
            fetchPage<PageProduct>('product', { populate: ['whyWeBestImages'] })(),
            fetchPage<PageProductCabin>('product-cabin', { populate: ['seo'] })()
        ]);
        const {
            data: { data: relatedProducts }
        } = await fetchCabins({
            filters: {
                sold: { $eq: false },
                id: {
                    $ne: data.id
                },
                model: data.model?.id || ''
            },
            populate: ['images', 'brand']
        });
        props = {
            data,
            page: {
                ...page,
                ...pageCabin,
                seo: getProductPageSeo(pageCabin.seo, data)
            },
            relatedProducts
        };
    } else if (modelParam) {
        let model = modelParam.replace('model-', '');
        const {
            data: { data }
        } = await fetchModelBySlug(model, {
            populate: ['seoCabins.images', 'image'],
            filters: { brand: { slug: brand } }
        });
        props = { page: { seo: withKindSparePart(data.seoCabins, 'салоны', kindSparePart) } };
    } else if (brand) {
        const {
            data: { data }
        } = await fetchBrandBySlug(brand, {
            populate: ['seoCabins.images', 'image']
        });
        props = { page: { seo: withKindSparePart(data.seoCabins, 'салоны', kindSparePart) } };
    } else {
        const {
            data: { data }
        } = await fetchPage('cabin')();
        props = { page: { seo: withKindSparePart(data.seo, 'салоны', kindSparePart) } };
    }
    return props;
});
