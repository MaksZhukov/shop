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
	UserMenuStore,
	type HeaderCatalogFilters,
	type HeaderSession
} from 'features/header';
import { OrderRegistrationStore } from 'features/orderRegistration';
import { AuthModalStore } from 'features/user';
import { SnackbarService } from 'shared/services';

export const appTokens = [
	ARTICLE_API,
	ArticleService,
	AUTOCOMISE_API,
	AutocomiseService,
	BRAND_API,
	BrandService,
	CABIN_API,
	CabinService,
	CAR_API,
	CarService,
	CAR_ON_PARTS_API,
	CarOnPartsService,
	CART_API,
	CartService,
	CartStore,
	CATALOG_API,
	CatalogService,
	EMAIL_API,
	EmailService,
	ENGINE_VOLUME_API,
	EngineVolumeService,
	FAVORITE_API,
	FavoriteService,
	FavoriteStore,
	GENERATION_API,
	GenerationService,
	KIND_SPARE_PART_API,
	KindSparePartService,
	MODEL_API,
	ModelService,
	ORDER_API,
	OrderService,
	PAGE_API,
	PageService,
	ProfileService,
	REVIEW_API,
	ReviewService,
	ReviewsService,
	ReviewsStore,
	ServiceStationsService,
	ServiceStationsStore,
	VacanciesService,
	VacanciesStore,
	SERVICE_STATION_API,
	ServiceStationService,
	SPARE_PART_API,
	SparePartService,
	TIRE_API,
	TireService,
	TIRE_BRAND_API,
	TireBrandService,
	TIRE_DIAMETER_API,
	TireDiameterService,
	TIRE_HEIGHT_API,
	TireHeightService,
	TIRE_WIDTH_API,
	TireWidthService,
	USER_API,
	UserService,
	UserStore,
	WHEEL_API,
	WheelService,
	WHEEL_DIAMETER_API,
	WheelDiameterService,
	WHEEL_DIAMETER_CENTER_HOLE_API,
	WheelDiameterCenterHoleService,
	WHEEL_DISK_OFFSET_API,
	WheelDiskOffsetService,
	WHEEL_NUMBER_HOLE_API,
	WheelNumberHoleService,
	WHEEL_WIDTH_API,
	WheelWidthService,
	SnackbarService,
	HEADER_SESSION,
	HEADER_CATALOG_FILTERS,
	HeaderService,
	HeaderStore,
	HeaderSearchService,
	HeaderSearchStore,
	HeaderCatalogService,
	HeaderCatalogStore,
	UserMenuStore,
	AuthModalStore,
	OrderRegistrationStore
] as const;

export const appContainer = { getKeys: () => appTokens };

export type AppBindings = {
	[ARTICLE_API]: ArticleApi;
	[AUTOCOMISE_API]: AutocomiseApi;
	[BRAND_API]: BrandApi;
	[CABIN_API]: CabinApi;
	[CAR_API]: CarApi;
	[CAR_ON_PARTS_API]: CarOnPartsApi;
	[CART_API]: CartApi;
	[CATALOG_API]: CatalogApi;
	[EMAIL_API]: EmailApi;
	[ENGINE_VOLUME_API]: EngineVolumeApi;
	[FAVORITE_API]: FavoriteApi;
	[GENERATION_API]: GenerationApi;
	[KIND_SPARE_PART_API]: KindSparePartApi;
	[MODEL_API]: ModelApi;
	[ORDER_API]: OrderApi;
	[PAGE_API]: PageApi;
	[REVIEW_API]: ReviewApi;
	[SERVICE_STATION_API]: ServiceStationApi;
	[SPARE_PART_API]: SparePartApi;
	[TIRE_API]: TireApi;
	[TIRE_BRAND_API]: TireBrandApi;
	[TIRE_DIAMETER_API]: TireDiameterApi;
	[TIRE_HEIGHT_API]: TireHeightApi;
	[TIRE_WIDTH_API]: TireWidthApi;
	[USER_API]: UserApi;
	[WHEEL_API]: WheelApi;
	[WHEEL_DIAMETER_API]: WheelDiameterApi;
	[WHEEL_DIAMETER_CENTER_HOLE_API]: WheelDiameterCenterHoleApi;
	[WHEEL_DISK_OFFSET_API]: WheelDiskOffsetApi;
	[WHEEL_NUMBER_HOLE_API]: WheelNumberHoleApi;
	[WHEEL_WIDTH_API]: WheelWidthApi;
	[HEADER_SESSION]: HeaderSession;
	[HEADER_CATALOG_FILTERS]: HeaderCatalogFilters;
};
