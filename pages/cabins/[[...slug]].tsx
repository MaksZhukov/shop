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
import { AxiosError, AxiosHeaders } from 'axios';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { KindSparePart } from 'api/kindSpareParts/types';
import { ReactElement, useEffect } from 'react';
import BrandsSlider from 'components/BrandsSlider/BrandsSlider';
import { Box } from '@mui/material';

interface Props {
    data: Cabin;
    relatedProducts: Cabin[];
    page: DefaultPage | (PageProduct & PageProductCabin);
    brands: Brand[];
    kindSparePart?: KindSparePart;
    setRenderBeforeFooter: (element: ReactElement | null) => void;
}

const Cabins: NextPage<Props> = ({ page, brands, data, relatedProducts, kindSparePart, setRenderBeforeFooter }) => {
    useEffect(() => {
        setRenderBeforeFooter(
            <Box marginY='1em'>
                <BrandsSlider linkType='cabins' brands={brands}></BrandsSlider>
            </Box>
        );
        return () => {
            setRenderBeforeFooter(null);
        };
    }, []);
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
    return (
        <CatalogCabins
            setRenderBeforeFooter={setRenderBeforeFooter}
            page={page}
            brands={brands}
            kindSparePart={kindSparePart}></CatalogCabins>
    );
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
