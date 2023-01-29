import type { NextPage } from 'next';
import { fetchSparePart, fetchSpareParts } from 'api/spareParts/spareParts';
import { getPageProps } from 'services/PagePropsService';
import { fetchPage } from 'api/pages';
import { PageMain, PageProduct, PageProductSparePart } from 'api/pages/types';
import { getProductPageSeo } from 'services/ProductService';
import { SparePart } from 'api/spareParts/types';
import Product from 'components/Product';

interface Props {
    data: SparePart;
    relatedProducts: SparePart[];
    page: PageProduct & PageProductSparePart;
}

const SpareParts: NextPage<Props> = ({ data, relatedProducts, page }) => {
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
};

export default SpareParts;

export const getServerSideProps = getPageProps(undefined, async (context) => {
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
        fetchSparePart(context.params?.slug || ''),
        fetchPage<PageProduct>('product', { populate: ['linksWithImages.image', 'benefits'] })(),
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
    return {
        data,
        page: {
            ...page,
            ...pageSparePart,
            textAfterDescription: pageSparePart.textAfterDescription.replace('{autoSynonyms}', randomAutoSynonym),
            seo: getProductPageSeo(pageSparePart.seo, data)
        },
        relatedProducts
    };
});
