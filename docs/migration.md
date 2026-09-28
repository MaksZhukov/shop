# Migration

Move the whole shop onto [architecture.md](architecture.md) one slice at a time. Do not rename the tree in one pass, and do not replace MobX and a widget in the same change.

`shared/di` provides `DiProvider` and `createModuleInjector`. `app` adds every container to one global container, and `pages/_app.tsx` renders that provider. Each feature exports `inject` from `createModuleInjector`, and that function accepts only the tokens bound for that feature. A port is added only when a page or feature calls another slice. Reading a store the component already owns does not get a port.

Article is the template: DTO, service map, `ArticleReader`, and no public `articlesApi`. Dictionary entities copy the DTO and map in the service. The index keeps exporting the API client until a port replaces it.

## Rules for every change

- New UI goes in `features/`, not `widgets/`.
- A file you touch gets a lowercase name and a role suffix (`btn.component.tsx`, `cart.store.ts`). A model file is `name.model.ts`, not `nameModel.ts`. Leave untouched files alone.
- Outside a slice, import from that slice's `index.ts` only. Do not import `entities/<name>/<name>Api`.
- An entity `index.ts` exports the model. It also exports the API client until a port replaces that client, then it exports the port instead. It does not export the DTO or the atoms.
- The DTO holds the fields. The model aliases the DTO (`export type Brand = BrandDto`) until the HTTP payload and the domain shape differ.
- `app/di/app.container.tsx` writes every `container.bind` and `pages/_app.tsx` renders `AppDiProvider`. A feature narrows that container with `export const inject = createModuleInjector<FeatureToken>()`. The entity exports the implementation class and does not bind it. Server code calls `createRequestContainer(context)` and `container.get(Token)`.

## 1. Finish the article template

Done. `ArticleService` lives in `entities/article` next to the `ArticleApi` class. The entity exports the class and does not bind it. `app/di/app.container.tsx` binds `ARTICLE_API` and `ArticleService`. `pages/_app.tsx` renders `AppDiProvider`. Articles and the main page narrow that container with `createModuleInjector<typeof ArticleService>()`, importing the class type from `entities/article`. Their server code calls `createRequestContainer().get(ArticleService)`.

## 2. Dictionary entities

Done. Same DTO as article. Each entity has an API class, a service, and a port, and `app/di/app.container.tsx` binds the symbol token and the service. The index still exports the API instance (`brandApi` and the rest) because catalogs still call it.

`engineVolume`, `kindSparePart`, `generation`, `model`, `tireDiameter`, `tireHeight`, `tireWidth`, `tireBrand`, `wheelDiameter`, `wheelDiameterCenterHole`, `wheelDiskOffset`, `wheelNumberHole`, `wheelWidth`, `brand`, `catalog`.

Each `index.ts` exports the model, the port, the service, and the API client. Helpers and UI that were already public stay public (`BrandItem`, `withGeneration`, `withKindSparePart`). The DTO stays private and holds the fields. The model aliases it (`export type Brand = BrandDto`). Every DTO has a model.

## 3. Content entities

Same shape. Add a port only where a page or feature still fetches from outside the entity.

1. `page` — used by almost every `getServerSideProps`. This is the first content port (`PageReader`) if those pages keep calling it.
2. `review`
3. `email`
4. `serviceStation`
5. `autocomise`

Done when those API clients are not imported from outside the entity.

## 4. Leaf widgets become features

Move the folder, point pages at `features/`, and rename files in that folder only.

1. `widgets/benefits`
2. `widgets/gallery`
3. `widgets/viewedProducts`
4. `widgets/locationEntityCard`
5. `widgets/pages`

Done when those five paths are gone.

## 5. Product entities

These are the payloads catalogs and product pages render. DTO stays private. The model is what features receive. Add a port when a second slice fetches that entity.

1. `product` — shared product model used by cart, favorites, and catalogs
2. `sparePart` — header search is the first port (`SparePartSearch`), bound by the header feature
3. `tire`
4. `wheel`
5. `cabin`
6. `car`
7. `carOnParts`

The header search port is the first `useDi` call. The cart badge stays on the cart hook.

Done when header search works without importing `sparePartApi`, and the other five clients are private to their entity.

## 6. MobX to Reatom

Install Reatom once. Replace one store per change. Atoms stay inside the slice. Drop `observer` only on the components that read the store you just replaced.

1. **Favorites.** `entities/favorite/favoriteStore.ts`, `FavoriteStoreProvider`. Readers: favorites page, `FavoriteButton`, header badge.
2. **Catalog filters.** `features/sparePartsCatalog/store/sparePartsCatalogFilterStore.ts`, `SparePartsCatalogFiltersStoreProvider`.
3. **Cart.** `entities/cart/cartStore.ts`, `CartStoreProvider`. Readers: cart page, `CartButton`, header badge, order registration. Add a cart port only if order registration must call cart without the cart hook.
4. **User.** `entities/user/userStore.ts`, `UserStoreProvider`. Last. Readers: profile, login, logout, route shield, API provider, header, footer.

Then remove `enableStaticRendering` and the `mobx` and `mobx-react` packages.

## 7. Session and order entities

After the matching Reatom store exists:

1. `favorite` — model and DTO; atoms not exported
2. `cart`
3. `user` — `UserReader` only for slices that load or clear the session without the user hook
4. `order` — used by order registration

## 8. Catalog features and their pages

The feature already exists. Move `getServerSideProps` query building into the feature. The page renders the feature and passes the route. One catalog per change.

1. `features/articlesList` with `pages/articles/index.tsx` and `pages/articles/[slug].tsx` (reader already started)
2. `features/sparePartsCatalog` with `pages/spare-parts/[[...slug]].tsx`
3. `features/tiresCatalog` with `pages/tires/[[...slug]].tsx` and `pages/tires/[brand]/[slug].tsx`
4. `features/wheelsCatalog` with `pages/wheels/[[...slug]].tsx`
5. `features/cabinsCatalog` with `pages/cabins/[[...slug]].tsx`
6. `features/mainPage` with `pages/index.tsx`

Each catalog's binds are written in `app/di/app.container.tsx`. The catalog narrows them with `createModuleInjector`. It does not render its own `DiProvider`.

## 9. Remaining features

Already in `features/`. When you touch one, rename its files and switch any cross-slice fetch to a port. No folder move.

1. `buy`, `share`, `scrollUp`, `workTimetable`, `mobileContacts`
2. `catalogFilters`, `productFilters`
3. `cart`, `favorites`, `user`
4. `orderRegistration`, `routeShield`

`mobileContacts` may keep its current import of `workTimetable` until both are touched. Then `workTimetable` is a port if the contacts modal still embeds it.

## 10. Large widgets

Move after the leaf widgets, the spare-part port, and the Reatom store that widget reads.

1. `widgets/orderRegistration` — after cart and user atoms exist
2. `widgets/cart`
3. `widgets/product`
4. `widgets/catalog` — spare parts, tires, wheels, and cabins stay behind one feature index
5. `widgets/main`
6. `widgets/footer`
7. `widgets/header` last — search, auth, cart, and favorites

## 11. Remaining pages

Static pages only compose features and entities. Touch one when its data entity from section 3 is done. No new logic in the page.

`about`, `contacts`, `delivery`, `guarantee`, `payment`, `privacy`, `vacancies`, `installment-plan`, `how-to-get-to`, `company-photo`, `car-dismantling-photos`, `reviews`, `autocomises`, `autocomises/[slug]`, `service-stations`, `service-stations/[slug]`, `mobile-catalog`.

Account pages follow their store: `favorites`, `cart`, `profile`, `order-registration`.

`404` and `500` stay as they are. `_document.tsx` stays the Next document. `_app.tsx` stays the entry: providers, layout, and `AppDiProvider`. Port bindings live in `app/di/app.container.tsx`, not in the page.

## 12. Turn the rules on

When `widgets/` is empty and MobX is gone:

- Drop the `widgets` element from `eslint.config.mjs`.
- Reject deep imports of an entity or feature from outside that slice.
- Reject a public `*Api` export.

Do this last. The linter would only flag slices that are not moved yet.
