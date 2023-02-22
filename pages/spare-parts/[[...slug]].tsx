import type { NextPage } from 'next';
import { Dispatch, SetStateAction, UIEventHandler, useEffect, useRef, useState } from 'react';
import { Brand } from 'api/brands/types';
import { ApiResponse, Filters, SEO } from 'api/types';
import { fetchModelBySlug, fetchModels } from 'api/models/models';
import { getPageProps } from 'services/PagePropsService';
import { fetchCars } from 'api/cars/cars';
import { fetchArticles } from 'api/articles/articles';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageMain, PageProduct, PageProductSparePart } from 'api/pages/types';
import { fetchBrandBySlug, fetchBrands } from 'api/brands/brands';
import Catalog from 'components/Catalog';
import { getParamByRelation } from 'services/ParamsService';
import { getSparePartsFiltersConfig } from 'components/Filters/config';
import { CircularProgress } from '@mui/material';
import { OFFSET_SCROLL_LOAD_MORE } from '../../constants';
import { EngineVolume } from 'api/engineVolumes/types';
import { fetchEngineVolumes } from 'api/engineVolumes/wheelWidths';
import { fetchGenerations } from 'api/generations/generations';
import { Model } from 'api/models/types';
import { AxiosResponse } from 'axios';
import { useDebounce, useThrottle } from 'rooks';
import { fetchKindSpareParts } from 'api/kindSpareParts/kindSpareParts';
import { useSnackbar } from 'notistack';
import { KindSparePart } from 'api/kindSpareParts/types';
import { Generation } from 'api/generations/types';
import { fetchSparePart, fetchSpareParts } from 'api/spareParts/spareParts';
import { useRouter } from 'next/router';
import { API_MAX_LIMIT } from 'api/constants';
import CatalogSpareParts from 'components/CatalogSpareParts';
import Product from 'components/Product';
import { getProductPageSeo } from 'services/ProductService';
import { SparePart } from 'api/spareParts/types';

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
                    { text: 'Тип топлива', value: data.fuel as any }
                ]}
                page={page as PageProduct & PageProductSparePart}
                relatedProducts={relatedProducts}></Product>
        );
    }
    return <CatalogSpareParts page={page} brands={brands}></CatalogSpareParts>;
};

export default SpareParts;

export const getServerSideProps = getPageProps(undefined, async (context) => {
    const { slug = [] } = context.query;
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
                price: { $gt: 0 },
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
        props = { page: { seo: data.seoSpareParts } };
    } else if (brand) {
        const {
            data: { data }
        } = await fetchBrandBySlug(brand, {
            populate: ['seoSpareParts.images', 'image']
        });
        props = { page: { seo: data.seoSpareParts } };
    } else {
        const {
            data: { data }
        } = await fetchPage('spare-part')();
        props = { page: { seo: data.seo } };
    }
    return props;
});
