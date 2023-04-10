import type { NextPage } from 'next';
import { Brand } from 'api/brands/types';
import { fetchModelBySlug, fetchModels } from 'api/models/models';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageProduct, PageProductSparePart } from 'api/pages/types';
import { fetchBrandBySlug } from 'api/brands/brands';
import { fetchSparePart, fetchSpareParts } from 'api/spareParts/spareParts';
import CatalogSpareParts from 'components/CatalogSpareParts';
import Product from 'components/Product';
import { getProductPageSeo } from 'services/ProductService';
import { SparePart } from 'api/spareParts/types';
import { withKindSparePart } from 'services/SEOService';

interface Props {
    data: SparePart;
    relatedProducts: SparePart[];
    page: DefaultPage;
    brands: Brand[];
}

const SpareParts: NextPage<Props> = ({ page, brands, data, relatedProducts }) => {
    if (data && relatedProducts) {
        return (
            <Product
                data={data}
                printOptions={[
                    { text: 'Поколение', value: data.generation?.name },
                    ...(data.engineNumber ? [{ text: 'Маркировка двигателя', value: data.engineNumber }] : []),
                    ...(data.engine ? [{ text: 'Двигатель', value: data.engine }] : []),
                    { text: 'Запчасть', value: data.kindSparePart?.name },
                    { text: 'Марка', value: data.brand?.name },
                    { text: 'Модель', value: data.model?.name },
                    { text: 'Год', value: data.year },
                    { text: 'Коробка', value: data.transmission },
                    { text: 'Обьем', value: data.volume?.name },
                    { text: 'Тип топлива', value: data.fuel as any },
                    {
                        text: 'Описание',
                        value: data.description
                    }
                ]}
                page={page as PageProduct & PageProductSparePart}
                relatedProducts={relatedProducts}></Product>
        );
    }
    return <CatalogSpareParts page={page} brands={brands}></CatalogSpareParts>;
};

export default SpareParts;

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
                data: { data: pageSparePart }
            }
        ] = await Promise.all([
            fetchSparePart(productParam),
            fetchPage<PageProduct>('product', { populate: ['whyWeBestImages'] })(),
            fetchPage<PageProductSparePart>('product-spare-part', { populate: ['seo'] })()
        ]);
        const {
            data: { data: relatedProducts }
        } = await fetchSpareParts({
            filters: {
                sold: { $eq: false },
                id: {
                    $ne: data.id
                },
                model: data.model?.id || ''
            },
            populate: ['images', 'brand']
        });
        const autoSynonyms = pageSparePart?.autoSynonyms.split(',') || [];
        let randomAutoSynonym = autoSynonyms[Math.floor(Math.random() * autoSynonyms.length)];
        props = {
            data,
            page: {
                ...page,
                ...pageSparePart,
                textAfterDescription: pageSparePart.textAfterDescription.replace('{autoSynonyms}', randomAutoSynonym),
                seo: getProductPageSeo(pageSparePart.seo, data)
            },
            relatedProducts
        };
    } else if (modelParam) {
        let model = modelParam.replace('model-', '');
        const {
            data: { data }
        } = await fetchModelBySlug(model, {
            populate: ['seoSpareParts.images', 'image'],
            filters: { brand: { slug: brand } }
        });
        props = { page: { seo: withKindSparePart(data.seoSpareParts, kindSparePart) } };
    } else if (brand) {
        const {
            data: { data }
        } = await fetchBrandBySlug(brand, {
            populate: ['seoSpareParts.images', 'image']
        });
        props = { page: { seo: withKindSparePart(data.seoSpareParts, kindSparePart) } };
    } else {
        const {
            data: { data }
        } = await fetchPage('spare-part')();
        props = { page: { seo: data.seo } };
    }
    return props;
});
