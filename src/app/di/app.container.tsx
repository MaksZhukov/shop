import 'reflect-metadata';
import { useState, type ReactNode } from 'react';
import { Container } from 'inversify';
import { ARTICLE_API, ArticleApi, ArticleService } from 'entities/article';
import { AUTOCOMISE_API, AutocomiseApi, AutocomiseService } from 'entities/autocomise';
import { BRAND_API, BrandApi, BrandService } from 'entities/brand';
import { CABIN_API, CabinApi, CabinService } from 'entities/cabin';
import { CAR_API, CarApi, CarService } from 'entities/car';
import { CAR_ON_PARTS_API, CarOnPartsApi, CarOnPartsService } from 'entities/carOnParts';
import { CART_API, CartApi, CartService, CartStore } from 'entities/cart';
import { CATALOG_API, CatalogApi, CatalogService } from 'entities/catalog';
import { EMAIL_API, EmailApi, EmailService } from 'entities/email';
import { ENGINE_VOLUME_API, EngineVolumeApi, EngineVolumeService } from 'entities/engineVolume';
import { FAVORITE_API, FavoriteApi, FavoriteService, FavoriteStore } from 'entities/favorite';
import { GENERATION_API, GenerationApi, GenerationService } from 'entities/generation';
import { KIND_SPARE_PART_API, KindSparePartApi, KindSparePartService } from 'entities/kindSparePart';
import { MODEL_API, ModelApi, ModelService } from 'entities/model';
import { ORDER_API, OrderApi, OrderService } from 'entities/order';
import { PAGE_API, PageApi, PageService } from 'entities/page';
import { REVIEW_API, ReviewApi, ReviewService } from 'entities/review';
import { ProfileService } from 'features/profile';
import { ReviewsService, ReviewsStore } from 'features/reviews';
import { ServiceStationsService, ServiceStationsStore } from 'features/serviceStations';
import { VacanciesService, VacanciesStore } from 'features/vacancies';
import { SERVICE_STATION_API, ServiceStationApi, ServiceStationService } from 'entities/serviceStation';
import { SPARE_PART_API, SparePartApi, SparePartService } from 'entities/sparePart';
import { TIRE_API, TireApi, TireService } from 'entities/tire';
import { TIRE_BRAND_API, TireBrandApi, TireBrandService } from 'entities/tireBrand';
import { TIRE_DIAMETER_API, TireDiameterApi, TireDiameterService } from 'entities/tireDiameter';
import { TIRE_HEIGHT_API, TireHeightApi, TireHeightService } from 'entities/tireHeight';
import { TIRE_WIDTH_API, TireWidthApi, TireWidthService } from 'entities/tireWidth';
import { USER_API, UserApi, UserService, UserStore } from 'entities/user';
import { WHEEL_API, WheelApi, WheelService } from 'entities/wheel';
import { WHEEL_DIAMETER_API, WheelDiameterApi, WheelDiameterService } from 'entities/wheelDiameter';
import { WHEEL_DIAMETER_CENTER_HOLE_API, WheelDiameterCenterHoleApi, WheelDiameterCenterHoleService } from 'entities/wheelDiameterCenterHole';
import { WHEEL_DISK_OFFSET_API, WheelDiskOffsetApi, WheelDiskOffsetService } from 'entities/wheelDiskOffset';
import { WHEEL_NUMBER_HOLE_API, WheelNumberHoleApi, WheelNumberHoleService } from 'entities/wheelNumberHole';
import { WHEEL_WIDTH_API, WheelWidthApi, WheelWidthService } from 'entities/wheelWidth';
import {
	HEADER_CATALOG_FILTERS,
	HEADER_SESSION,
	HeaderCatalogService,
	HeaderCatalogStore,
	HeaderSearchService,
	HeaderSearchStore,
	HeaderService,
	HeaderStore,
	UserMenuStore
} from 'features/header';
import { OrderRegistrationStore } from 'features/orderRegistration';
import { AuthModalStore } from 'features/user';
import { DiProvider } from 'shared/di/di.context';
import { HeaderCatalogFiltersAdapter, HeaderSessionAdapter } from './header.adapters';
import { SnackbarService } from 'shared/services';

export const createAppContainer = () => {
	const container = new Container();
	container.bind(ARTICLE_API).to(ArticleApi);
	container.bind(ArticleService).toSelf();
	container.bind(AUTOCOMISE_API).to(AutocomiseApi);
	container.bind(AutocomiseService).toSelf();
	container.bind(BRAND_API).to(BrandApi);
	container.bind(BrandService).toSelf();
	container.bind(CABIN_API).to(CabinApi);
	container.bind(CabinService).toSelf();
	container.bind(CAR_API).to(CarApi);
	container.bind(CarService).toSelf();
	container.bind(CAR_ON_PARTS_API).to(CarOnPartsApi);
	container.bind(CarOnPartsService).toSelf();
	container.bind(CART_API).to(CartApi);
	container.bind(CartService).toSelf();
	container.bind(CartStore).toSelf().inSingletonScope();
	container.bind(CATALOG_API).to(CatalogApi);
	container.bind(CatalogService).toSelf();
	container.bind(EMAIL_API).to(EmailApi);
	container.bind(EmailService).toSelf();
	container.bind(ENGINE_VOLUME_API).to(EngineVolumeApi);
	container.bind(EngineVolumeService).toSelf();
	container.bind(FAVORITE_API).to(FavoriteApi);
	container.bind(FavoriteService).toSelf();
	container.bind(FavoriteStore).toSelf().inSingletonScope();
	container.bind(GENERATION_API).to(GenerationApi);
	container.bind(GenerationService).toSelf();
	container.bind(KIND_SPARE_PART_API).to(KindSparePartApi);
	container.bind(KindSparePartService).toSelf();
	container.bind(MODEL_API).to(ModelApi);
	container.bind(ModelService).toSelf();
	container.bind(ORDER_API).to(OrderApi);
	container.bind(OrderService).toSelf();
	container.bind(PAGE_API).to(PageApi);
	container.bind(PageService).toSelf();
	container.bind(ProfileService).toSelf().inSingletonScope();
	container.bind(REVIEW_API).to(ReviewApi);
	container.bind(ReviewService).toSelf();
	container.bind(ReviewsService).toSelf();
	container.bind(ReviewsStore).toSelf().inSingletonScope();
	container.bind(ServiceStationsService).toSelf();
	container.bind(ServiceStationsStore).toSelf().inSingletonScope();
	container.bind(VacanciesService).toSelf();
	container.bind(VacanciesStore).toSelf().inSingletonScope();
	container.bind(SERVICE_STATION_API).to(ServiceStationApi);
	container.bind(ServiceStationService).toSelf();
	container.bind(SPARE_PART_API).to(SparePartApi);
	container.bind(SparePartService).toSelf();
	container.bind(TIRE_API).to(TireApi);
	container.bind(TireService).toSelf();
	container.bind(TIRE_BRAND_API).to(TireBrandApi);
	container.bind(TireBrandService).toSelf();
	container.bind(TIRE_DIAMETER_API).to(TireDiameterApi);
	container.bind(TireDiameterService).toSelf();
	container.bind(TIRE_HEIGHT_API).to(TireHeightApi);
	container.bind(TireHeightService).toSelf();
	container.bind(TIRE_WIDTH_API).to(TireWidthApi);
	container.bind(TireWidthService).toSelf();
	container.bind(USER_API).to(UserApi);
	container.bind(UserService).toSelf().inSingletonScope();
	container.bind(UserStore).toSelf().inSingletonScope();
	container.bind(WHEEL_API).to(WheelApi);
	container.bind(WheelService).toSelf();
	container.bind(WHEEL_DIAMETER_API).to(WheelDiameterApi);
	container.bind(WheelDiameterService).toSelf();
	container.bind(WHEEL_DIAMETER_CENTER_HOLE_API).to(WheelDiameterCenterHoleApi);
	container.bind(WheelDiameterCenterHoleService).toSelf();
	container.bind(WHEEL_DISK_OFFSET_API).to(WheelDiskOffsetApi);
	container.bind(WheelDiskOffsetService).toSelf();
	container.bind(WHEEL_NUMBER_HOLE_API).to(WheelNumberHoleApi);
	container.bind(WheelNumberHoleService).toSelf();
	container.bind(WHEEL_WIDTH_API).to(WheelWidthApi);
	container.bind(WheelWidthService).toSelf();
	container.bind(SnackbarService).toSelf().inSingletonScope();
	container.bind(HEADER_SESSION).to(HeaderSessionAdapter).inSingletonScope();
	container.bind(HEADER_CATALOG_FILTERS).to(HeaderCatalogFiltersAdapter).inSingletonScope();
	container.bind(HeaderService).toSelf().inSingletonScope();
	container.bind(HeaderStore).toSelf().inSingletonScope();
	container.bind(HeaderSearchService).toSelf().inSingletonScope();
	container.bind(HeaderSearchStore).toSelf().inSingletonScope();
	container.bind(HeaderCatalogService).toSelf().inSingletonScope();
	container.bind(HeaderCatalogStore).toSelf().inSingletonScope();
	container.bind(UserMenuStore).toSelf().inSingletonScope();
	container.bind(AuthModalStore).toSelf().inSingletonScope();
	container.bind(OrderRegistrationStore).toSelf();
	return container;
};

export const createRequestContainer = () => {
	const container = createAppContainer();
	return container;
};

export const AppDiProvider = ({ children }: { children: ReactNode }) => {
	const [container] = useState(createAppContainer);
	return <DiProvider container={container}>{children}</DiProvider>;
};
