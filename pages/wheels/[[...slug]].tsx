import type { NextPage } from 'next';
import { SEO } from 'api/types';
import { fetchBrandBySlug } from 'api/brands/brands';
import { fetchModelBySlug } from 'api/models/models';
import { Brand } from 'api/brands/types';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageProduct, PageProductWheel } from 'api/pages/types';
import CatalogWheels from 'components/CatalogWheels';
import Product from 'components/Product';
import { Wheel } from 'api/wheels/types';
import { getProductPageSeo } from 'services/ProductService';
import { fetchWheel, fetchWheels } from 'api/wheels/wheels';
import { withKindSparePart } from 'services/SEOService';
import { AxiosError, AxiosHeaders } from 'axios';
import { ReactElement } from 'react-markdown/lib/react-markdown';

interface Props {
    data?: Wheel;
    relatedProducts?: Wheel[];
    page: DefaultPage | (PageProduct & PageProductWheel);
    brands: Brand[];
    setRenderBeforeFooter: (element: ReactElement) => void;
}

const Wheels: NextPage<Props> = ({ page, brands, data, relatedProducts, setRenderBeforeFooter }) => {
    if (data && relatedProducts) {
        return (
            <Product
                data={data}
                printOptions={[
                    { text: 'Артикул', value: data.id },
                    { text: 'Тип', value: data.kind },
                    { text: 'Количество', value: data.count },
                    { text: 'Марка', value: data.brand?.name },
                    { text: 'Модель', value: data.model?.name },
                    { text: 'R Диаметр', value: data.diameter?.name },
                    { text: 'J Ширина', value: data.width?.name },
                    { text: 'Количество отверстий', value: data.numberHoles?.name },
                    { text: 'PCD расстояние между отверстиями', value: data.numberHoles?.name },
                    {
                        text: 'DIA диаметр центрального отверстия',
                        value: data.diameterCenterHole?.name
                    },
                    {
                        text: 'ET вылет',
                        value: data.diskOffset?.name
                    },
                    {
                        text: 'Описание',
                        value: data.description
                    }
                ]}
                page={page as PageProduct & PageProductWheel}
                relatedProducts={relatedProducts}></Product>
        );
    }
    return <CatalogWheels setRenderBeforeFooter={setRenderBeforeFooter} page={page} brands={brands}></CatalogWheels>;
};

export default Wheels;

export const getServerSideProps = getPageProps(undefined, async (context) => {
    const { slug = [], kindSparePart } = context.query;
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
                data: { data: pageWheel }
            }
        ] = await Promise.all([
            fetchWheel(productParam),
            fetchPage<PageProduct>('product', { populate: ['whyWeBest.image'] })(),
            fetchPage<PageProductWheel>('product-wheel', { populate: ['seo'] })()
        ]);
        const {
            data: { data: relatedProducts }
        } = await fetchWheels({
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
                ...pageWheel,
                seo: getProductPageSeo(pageWheel.seo, data)
            },
            relatedProducts
        };
        // }
    } else if (modelParam) {
        let model = modelParam.replace('model-', '');
        const {
            data: { data }
        } = await fetchModelBySlug(model, {
            populate: ['seoWheels.images', 'image'],
            filters: { brand: { slug: brand } }
        });
        props = { page: { seo: withKindSparePart(data.seoWheels, 'диски', kindSparePart) } };
    } else if (brand) {
        const {
            data: { data }
        } = await fetchBrandBySlug(brand, {
            populate: ['seoWheels.images', 'image']
        });
        props = { page: { seo: withKindSparePart(data.seoWheels, 'диски', kindSparePart) } };
    } else {
        const {
            data: { data }
        } = await fetchPage('wheel')();
        props = { page: { seo: withKindSparePart(data.seo, 'диски', kindSparePart) } };
    }
    return props;
});
