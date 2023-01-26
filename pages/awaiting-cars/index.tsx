import { fetchArticles } from 'api/articles/articles';
import { Article } from 'api/articles/types';
import { Autocomis } from 'api/autocomises/types';
import { Brand } from 'api/brands/types';
import { fetchCars } from 'api/cars/cars';
import { Car } from 'api/cars/types';
import { API_MAX_LIMIT, API_UN_LIMIT } from 'api/constants';
import { fetchPage } from 'api/pages';
import { DefaultPage, PageMain } from 'api/pages/types';
import { ServiceStation } from 'api/serviceStations/types';
import { ApiResponse, LinkWithImage } from 'api/types';
import CatalogCars from 'components/CatalogCars';
import { NextPage } from 'next';
import { UIEventHandler } from 'react';
import { getPageProps } from 'services/PagePropsService';

interface Props {
    page: DefaultPage;
    articles: Article[];
    advertising: LinkWithImage[];
    autocomises: Autocomis[];
    deliveryAuto: LinkWithImage;
    serviceStations: ServiceStation[];
    discounts: LinkWithImage[];
    cars: ApiResponse<Car[]>;
    brands: ApiResponse<Brand[]>;
    onScrollBrandsList: UIEventHandler<HTMLUListElement>;
}

const AwaitingCars: NextPage<Props> = ({
    page,
    articles,
    autocomises,
    advertising,
    deliveryAuto,
    discounts,
    brands,
    serviceStations,
    onScrollBrandsList
}) => {
    return (
        <CatalogCars
            onScrollBrandsList={onScrollBrandsList}
            page={page}
            articles={articles}
            autocomises={autocomises}
            advertising={advertising}
            deliveryAuto={deliveryAuto}
            discounts={discounts}
            brands={brands.data}
            serviceStations={serviceStations}
            fetchCarsApi={fetchCars}></CatalogCars>
    );
};

export default AwaitingCars;

export const getServerSideProps = getPageProps(
    fetchPage('awaiting-car'),
    async () => {
        const {
            data: {
                data: { advertising, deliveryAuto, discounts, autocomises, serviceStations }
            }
        } = await fetchPage<PageMain>('main')();
        return {
            advertising,
            deliveryAuto,
            autocomises,
            serviceStations,
            discounts
        };
    },
    async () => ({
        articles: (await fetchArticles({ populate: 'image' })).data.data
    })
);
