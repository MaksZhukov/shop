# Migration

Move the whole shop onto [architecture.md](architecture.md) one slice at a time. Do not rename the tree in one pass, and do not replace MobX and a widget in the same change.

`shared/di` provides `DiProvider` and `createModuleInjector`. `app` adds every container to one global container, and `pages/_app.tsx` renders that provider. Each page or feature that needs DI exports `inject` from `createModuleInjector([...tokens])`, and that function accepts only the tokens listed in the array. A port is added only when a page or feature calls another slice. Reading a store the component already owns does not get a port.

Article is the template: DTO, service map, `ArticleReader`, and no public `articlesApi`. Dictionary entities copy the DTO and map in the service. The index exports the PascalCase API class and its token. It does not export a camelCase `*Api` singleton.

## Rules for every change

- New UI goes in `features/`, not `widgets/`.
- A file you touch gets a lowercase name and a role suffix (`btn.component.tsx`, `cart.store.ts`). A model file is `name.model.ts`, not `nameModel.ts`. Leave untouched files alone.
- Outside a slice, import from that slice's `index.ts` only. Do not import `entities/<name>/<name>Api`.
- An entity `index.ts` exports the model, the port, the service, and the PascalCase API class with its token. It does not export a camelCase `*Api` singleton, the DTO, or the atoms.
- The DTO holds the fields. The model aliases the DTO (`export type Brand = BrandDto`) until the HTTP payload and the domain shape differ.
- `app/di/app.container.tsx` writes every `container.bind` and `pages/_app.tsx` renders `AppDiProvider`. A page or feature narrows that container with `export const inject = createModuleInjector([FeatureStore])`. The entity exports the implementation class and does not bind it. Server code calls `createRequestContainer().get(Token)`.

## 1. Finish the article template

Done. `ArticleService` lives in `entities/article` next to the `ArticleApi` class. The entity exports the class and does not bind it. `app/di/app.container.tsx` binds `ARTICLE_API` and `ArticleService`. `pages/_app.tsx` renders `AppDiProvider`. Articles and the main page narrow that container with `createModuleInjector<typeof ArticleService>()`, importing the class type from `entities/article`. Their server code calls `createRequestContainer().get(ArticleService)`.

## 2. Dictionary entities

Done. Same DTO as article. Each entity has an API class, a service, and a port, and `app/di/app.container.tsx` binds the symbol token and the service. The index exports the PascalCase class and the token. Callers use the service.

`engineVolume`, `kindSparePart`, `generation`, `model`, `tireDiameter`, `tireHeight`, `tireWidth`, `tireBrand`, `wheelDiameter`, `wheelDiameterCenterHole`, `wheelDiskOffset`, `wheelNumberHole`, `wheelWidth`, `brand`, `catalog`.

Each `index.ts` exports the model, the port, the service, and the API class. Helpers and UI that were already public stay public (`BrandItem`, `withGeneration`, `withKindSparePart`). The DTO stays private and holds the fields. The model aliases it (`export type Brand = BrandDto`). Every DTO has a model.

## 3. Content entities

Done. `page`, `review`, `email`, `serviceStation`, and `autocomise` keep their API classes private. Pages resolve `PageService` and the other services with `createRequestContainer().get`. Client calls resolve through the page's own `inject` (`pages/contacts.tsx` resolves `EmailService`). `features/content` is gone.

## 4. Leaf widgets become features

Done. `benefits`, `gallery`, and `viewedProducts` live in `features/`. `locationEntityCard` and `pages` were already absent.

## 5. Product entities

Done. `product`, `sparePart`, `tire`, `wheel`, `cabin`, `car`, and `carOnParts` keep their API classes inside the entity. Header search calls `SparePartService` through `inject`. It does not import `sparePartApi`. The cart and favorites badges read the Reatom stores.

## 6. MobX to Reatom

Done. `@reatom/core` and `@reatom/react` replace MobX. Atoms stay inside the slice. Components that read a store during render use `reatomComponent`. `enableStaticRendering`, the store providers, and the `mobx` and `mobx-react` packages are gone.

New stores are injectable classes (see **Stores** in [architecture.md](architecture.md)). `reviews`, `serviceStations`, `vacancies`, `user`, `cart`, and `favorite` already follow that shape. Catalog filter stores still use the older module-level object and `use*Store` hook. Migrate them when you touch the slice.

## 7. Session and order entities

Done. `favorite`, `cart`, `user`, and `order` follow the article shape: private DTO, model alias, service, and no exported atoms. Session reads go through the store hooks. Order registration receives `removeCartMany` from the page.

## 8. Catalog features and their pages

Done. Spare parts, tires, wheels, and cabins live under `features/catalog` and are exported from that index. Articles stay in `features/articlesList`. The main page sections are exported from `features/mainPage`.

Each page creates `createRequestContainer()`, passes the services into the feature's `buildPageProps`, and renders the catalog or product feature. Buttons and filters are render props from the page. The catalog does not render its own `DiProvider`. Binds stay in `app/di/app.container.tsx`.

## 9. Remaining features

Done. Cross-slice UI is a render prop from the page or from `_app`: cart and favorite buttons, share, filters, auth modal, work timetable, and the mobile contacts modal. `mobileContacts` no longer imports `workTimetable`. Files that were rewritten use the lowercase role suffix. Untouched files keep their names.

## 10. Large widgets

Done. `widgets/` is gone. Order registration, cart, product, catalog, main page sections, footer, and header live in `features/`. Catalog data and catalog UI share `features/catalog`. Header search filters and the search placeholder are passed from `_app`.

## 11. Remaining pages

Done. Static pages compose the content services from section 3. `mobile-catalog` resolves `SparePartService` on the server and `KindSparePartService` through `inject` from `features/catalog`. Account pages read the Reatom stores. `404` and `500` stay as they are. `_document.tsx` stays the Next document. `_app.tsx` is the entry: providers, layout, header, footer, and `AppDiProvider`.

## 12. Turn the rules on

Done. `eslint.config.mjs` no longer has a `widgets` layer. A feature or entity import from outside its slice must go through `index.ts`. An entity `index.ts` must not export a camelCase `*Api` client. PascalCase classes such as `ArticleApi` stay exported so `app` can bind them.

## 13. Account pages on injectable stores

`profile` is done. `features/profile` has UI, bound context, and `ProfileService`. The save is `UserService.saveUserInfo` in `entities/user`, an `action` with `withAsync`. It reads the form values from `UserStore`, calls `updateUserInfo`, and reports through `SnackbarService`. `UserService` is bound with `inSingletonScope()`. `ProfileService.logout` is an `action` with `withAsync`. It clears `UserStore`, keeps only the guest cart and favorites found in local storage, clears the checkout selection, calls `UserService.logout`, and reports through `SnackbarService`. `RouteShield` then redirects away from `/profile`. `pages/profile.tsx` defines `inject` with `createModuleInjector([ProfileService, UserService, UserStore])` and passes all three into `ProfileInjector` (`profile.context.tsx`). `ProfileForm` and `ProfileLogout` read them with `useDI` from `profile.di.ts`. `useSaveUserInfo` is gone from `features/user`.

`UserStore` in `entities/user` is an injectable class bound with `inSingletonScope()`. The module-level `userStore` object is gone. `entities/user` exports only the class, with no hook.

`CartStore` and `FavoriteStore` follow the same shape. The module-level `cartStore` and `favoriteStore` objects and the `useCartStore` and `useFavoriteStore` entity hooks are gone. `header` gets `UserStore`, `CartStore`, `FavoriteStore`, `CatalogService`, `SparePartService`, and the `HEADER_SESSION`, `HEADER_CATALOG_FILTERS`, and `HEADER_SLOTS` ports from `HeaderWrapper` through `HeaderInjector`, and reads them with `useDI`. `_app` renders `<HeaderWrapper />` with no props. The `cart` and `favorites` pages resolve them with their own `inject`.

The header menu logs out through `HEADER_SESSION`, which calls `ProfileService.logout`. The footer still receives `loadCart` and `loadFavorites` as props from `_app`.

`reviews`, `serviceStations`, and `vacancies` switch between loading and content with `AsyncWrapper` from `shared/ui`. The entry component computes `loading` from the store and passes it in.

## 14. Features read only bound context

Done. Every feature except `header` has `*.context.tsx` with `XContext` and `XInjector`, and `*.di.ts` with only `useDI`. No feature calls `createModuleInjector` or `inject`, and no feature exports a store hook.

- `app/providers/FeatureProviders.tsx` resolves with `useInjection` and renders `UserInjector`, `CartInjector`, `FavoritesInjector`, `FooterInjector`, and `RouteShieldInjector` around the app. `ApiProvider` and `useInitialAuthLoad` resolve `UserService` and `UserStore` with `useInjection`.
- Pages provide the rest: `index` (`MainPageInjector`, `BenefitsInjector`), `mobile-catalog` (`BenefitsInjector`), `cart` (`ViewedProductsInjector`), `favorites` (`ViewedProductsInjector`), `order-registration` (`OrderRegistrationInjector`), `spare-parts`, `cabins`, `tires`, `wheels` (their catalog injectors), `articles` (`ArticlesListContext`), `vacancies`, `reviews`, `service-stations`, `profile`.
- `features/buy` has a context, but no page renders `BuyButton` yet.

## 15. Header on Reatom

Done. `features/header/hooks` is gone. `HeaderStore` and `HeaderService` replace `useSearchSpareParts`, `useHeaderSearchPlaceholder`, `useAuthModal`, `useMobileModals`, `useSearchHistory`, and the react-query calls in `CatalogCategories`. Both are bound with `inSingletonScope()` in `app/di/app.container.tsx`. The header's search and categories no longer share the react-query cache with the main page.

## 16. Header sub-features, one auth modal

Done. `features/header` has `search`, `catalogMenu`, and `userMenu` sub-features next to the root layout. Every piece of header state is in `HeaderStore`, `HeaderSearchStore`, `HeaderCatalogStore`, or `UserMenuStore`. `HEADER_SLOTS` is gone: `WorkTimetable` moved from `features/workTimetable` to `shared/ui`, and the auth modal renders once from `_app` through `AuthModalRoot` and `AuthModalStore`. `Footer` takes no props; its auth modal and `useFooterAuthModal` are gone.

## 17. Content pages and order registration as features

Done. Pages are thin: they resolve dependencies, fill the feature injector, and render the feature `*Entry`.

- `features/payment`: `PaymentInjector` with the CMS `page`, `PaymentEntry` renders the header and markdown. No store, because nothing loads on the client.
- `features/privacy`: `PrivacyEntry` with `PrivacyHeader`, `PrivacyContent`, `PrivacySectionTitle`, and `PrivacySiteLink`. It has no dependencies, so it has no context.
- `features/orderRegistration`: `OrderRegistrationStore` holds `isOrdered`, `checkoutItems`, `totalAmount`, `isLoading`, and `hasNothingToCheckout`. It is bound transient, so each visit starts clean. `OrderRegistrationEntry` redirects to the cart, shows the loader through `AsyncWrapper`, and loads the bePaid widget. The page passes `removeCartMany` and `renderMobileContacts` through `OrderRegistrationInjector`. The second `OrderRegistrationContext` (`orderRegistrationContext.ts`, `OrderRegistrationProvider`) and `useOrderRegistration` are gone. `useOrderCheckout` and `useOrderRegistrationForm` are still React hooks with react-query.
