import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { CabinService } from 'entities/cabin';
import type { Cart, CartProducts, StorageCart } from 'entities/cart';
import type { Favorite, FavoriteProducts, StorageFavorite } from 'entities/favorite';
import { fetchProductsByType } from 'entities/product';
import { SparePartService } from 'entities/sparePart';
import { TireService } from 'entities/tire';
import { WheelService } from 'entities/wheel';

/** Refetches products for guest cart items and favorites. Lives in `app`, the only layer that sees every product entity. */
@injectable()
export class StoredProductsAdapter implements CartProducts, FavoriteProducts {
	constructor(
		@inject(SparePartService) private readonly sparePartService: SparePartService,
		@inject(WheelService) private readonly wheelService: WheelService,
		@inject(TireService) private readonly tireService: TireService,
		@inject(CabinService) private readonly cabinService: CabinService
	) {}

	findStored(items: StorageCart[]): Promise<{ found: Cart[]; missingIds: number[] }>;
	findStored(items: StorageFavorite[]): Promise<{ found: Favorite[]; missingIds: number[] }>;
	findStored(items: (StorageCart | StorageFavorite)[]) {
		return fetchProductsByType(items, {
			sparePart: (params) => this.sparePartService.fetchSpareParts(params),
			wheel: (params) => this.wheelService.fetchWheels(params),
			tire: (params) => this.tireService.fetchTires(params),
			cabin: (params) => this.cabinService.fetchCabins(params)
		});
	}
}
