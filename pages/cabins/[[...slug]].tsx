import { fetchBrandBySlug } from 'api/brands/brands';
import { Brand } from 'api/brands/types';
import { fetchCabin, fetchCabins } from 'api/cabins/cabins';
import { Cabin } from 'api/cabins/types';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePart } from 'api/kindSpareParts/types';
import { fetchModelBySlug } from 'api/models/models';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageProduct, PageProductCabin } from 'api/pages/types';
import CatalogCabins from 'components/CatalogCabins';
import Product from 'components/Product';
import type { NextPage } from 'next';
import { getPageProps } from 'services/PagePropsService';
import { getProductPageSeo } from 'services/ProductService';
import { withKindSparePart } from 'services/SEOService';

interface Props {
    data: Cabin;
    relatedProducts: Cabin[];
    page: DefaultPage | (PageProduct & PageProductCabin);
    brands: Brand[];
    kindSparePart?: KindSparePart;
}

const Cabins: NextPage<Props> = ({ page, brands, data, relatedProducts, kindSparePart }) => {
    if (data) {
        return (
            <Product
                brands={brands}
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
    return <CatalogCabins page={page} brands={brands} kindSparePart={kindSparePart}></CatalogCabins>;
};

export default Cabins;

export const getServerSideProps = getPageProps(undefined, async (context) => {
    const { slug = [], kindSparePart: kindSparePartSlug } = context.query;
    const [brand, modelOrProductParam] = slug;

    const productParam =
        modelOrProductParam && !modelOrProductParam.includes('model-') ? modelOrProductParam : undefined;
    const modelParam = modelOrProductParam && modelOrProductParam.includes('model-') ? modelOrProductParam : undefined;
    let props: any = {};
    if (productParam) {
        // if (brand.toLowerCase() === 'undefined') {
        //     throw new AxiosError(undefined, undefined, undefined, undefined, {
        //         statusText: '',
        //         config: { headers: new AxiosHeaders() },
        //         headers: {},
        //         data: {},
        //         status: 404
        //     });
        // } else {
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
            fetchPage<PageProduct>('product', { populate: ['whyWeBest.image'] })(),
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
        // }
    } else if (modelParam) {
        let model = modelParam.replace('model-', '');
        const [
            {
                data: { data }
            },
            resultKindSpareParts
        ] = await Promise.all([
            fetchModelBySlug(model, {
                populate: ['seoCabins.images', 'image'],
                filters: { brand: { slug: brand } }
            }),
            ...(kindSparePartSlug ? [fetchKindSpareParts({ filters: { slug: kindSparePartSlug } })] : [])
        ]);
        const kindSparePart = resultKindSpareParts?.data?.data[0];
        props = {
            page: { seo: withKindSparePart(data.seoCabins, 'салоны', kindSparePart?.name) },
            ...(kindSparePart ? { kindSparePart } : {})
        };
    } else if (brand) {
        const [
            {
                data: { data }
            },
            resultKindSpareParts
        ] = await Promise.all([
            fetchBrandBySlug(brand, {
                populate: ['seoCabins.images', 'image']
            }),
            ...(kindSparePartSlug ? [fetchKindSpareParts({ filters: { slug: kindSparePartSlug } })] : [])
        ]);
        const kindSparePart = resultKindSpareParts?.data?.data[0];
        props = {
            page: { seo: withKindSparePart(data.seoCabins, 'салоны', kindSparePart?.name) },
            ...(kindSparePart ? { kindSparePart } : {})
        };
    } else {
        const [
            {
                data: { data }
            },
            resultKindSpareParts
        ] = await Promise.all([
            fetchPage('cabin')(),
            ...(kindSparePartSlug ? [fetchKindSpareParts({ filters: { slug: kindSparePartSlug } })] : [])
        ]);
        const kindSparePart = resultKindSpareParts?.data?.data[0];
        props = {
            page: { seo: withKindSparePart(data.seo, 'салоны', kindSparePart?.name) },
            ...(kindSparePart ? { kindSparePart } : {})
        };
    }
    return props;
});
