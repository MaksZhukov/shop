# Architecture

Layers are `app`, `pages`, `features`, `entities`, `core`, and `shared`. There is no `widgets` layer.

Cross-feature and cross-entity work goes through an InversifyJS IoC container. The data that crosses that boundary is a model owned by the entity. A DTO exists only at the HTTP edge and is mapped into that model inside the entity.

`widgets/` is still on disk. It is not part of this architecture. When you change a widget, move it into the owning feature. Do not add a new folder under `widgets/`.

## Layers

| Layer | Role | May import |
| --- | --- | --- |
| `app` | Startup, app-wide providers, and the one IoC container | `pages`, `features`, `entities`, `shared` |
| `pages` | One route. Compose feature UI. Load data for that route | `features` and `entities` public API, `shared` |
| `features` | One product capability: UI and behavior | `entities` public API, `shared`. Other features only by injected ports |
| `entities` | One domain object: DTO, model, port, and the implementation behind that port | `core`, `shared`. Other entities only by injected ports |
| `core` | Code reused between entities that belongs to no single entity: the session (`core/session`) | `shared`, other `core` slices |
| `shared` | UI kit, HTTP client, formatters, icons | other `shared` code |

`pages/_app.tsx` is the Next.js entry. It renders the app root. No other file imports `app`.

A page does not contain a product rule that a second page also needs. That rule is a feature.

## Feature shape

```
features/cart/
├── ui/
│   └── btn.component.tsx
├── cart.service.ts         # this feature's own behavior
├── cart.store.ts           # @injectable() store class, not exported
└── index.ts                # cart button

entities/product/
├── dto/
│   └── product.dto.ts      # HTTP payload
├── model/
│   └── product.model.ts    # domain shape features use
├── ports/
│   └── product.port.ts     # returns Product, not ProductDto
├── product.api.ts          # HTTP client
├── product.service.ts      # maps the DTO, implements the port
└── index.ts                # Product, ProductReader, and the implementation class
```

File names are lowercase. The role sits after a dot: `btn.component.tsx`, `cart.service.ts`, `cart.store.ts`, `article.model.ts`. A model file is `name.model.ts`, not `nameModel.ts`. Same stem, different suffix, so the kind of file is visible without opening it. `pages/_app.tsx` keeps the name Next.js requires.

| Suffix | Holds |
| --- | --- |
| `.component.tsx` | UI |
| `.service.ts` | Entity file when it maps the DTO and implements the entity port. Feature file when it holds that feature's own behavior |
| `.store.ts` | Injectable store class with Reatom atoms |
| `.api.ts` | HTTP client |
| `.dto.ts` | HTTP payload |
| `.model.ts` | Domain shape. File name is `name.model.ts` |
| `.port.ts` | Interface other slices depend on |
| `.context.tsx` | React context |
| `.hook.ts` | React hook |
| `.container.ts` | Server `get` when a feature still builds a container. The app container in `app/di/app.container.tsx` is the one client and articles server code use. Not on an entity |

A feature `index.ts` exports the component, the store or service class, and the bound-context pieces (`VacanciesInjector`, `useDI`). `app/di/app.container.tsx` writes every `container.bind(TOKEN).to(Impl)`. `pages/_app.tsx` renders `AppDiProvider`. The feature's `*.di.ts` holds only `useDI`, which reads the feature context. The feature does not call `createModuleInjector` or `inject`. An entity `index.ts` exports the model, the port, and the implementation class. When another slice still fetches through the API client, the index exports that client too. After a port replaces the client, the index stops exporting the API. It does not export the DTO, Reatom atoms, or a container.

Inside the slice, import with relative paths. From outside, import `features/cart` or `entities/product` only. Do not import an API file by its path.

## DTOs and models

Both are plain TypeScript types: fields and unions only, no methods, no Reatom atoms, no Axios response types.

A **DTO** is the HTTP payload. It stays inside the entity. The entity maps it once, at the edge, into a model.

A **model** is the domain shape. Ports return models. Features and pages import the model from `entities/<name>`. Do not put product DTOs or models in `shared` or in a feature.

For now the model and the DTO are the same shape. The DTO holds the fields. The model aliases the DTO. Give them different fields only when the HTTP payload and the domain shape actually differ.

```typescript
// entities/brand/dto/brand.dto.ts
export interface BrandDto {
	id: number;
	name: string;
	slug: string;
}

// entities/brand/model/brand.model.ts
export type Brand = BrandDto;
```

## IoC container

`app/di/app.container.tsx` creates one container and writes every `container.bind` there. `pages/_app.tsx` renders that provider around the tree. A feature does not create the provider and does not resolve from the container. The page (or `app`) narrows the container with `createModuleInjector`, resolves what the feature needs, and passes it into the feature `*Injector`. The entity does not create a container and does not bind.

```
shared/di/
├── di.context.tsx  # DiProvider, the bound context
├── di.hook.ts      # useInjection and createModuleInjector. Tokens come from appContainer.getKeys
└── di.util.ts      # BoundValue: class token → instance, symbol token → binding
```

```tsx
// app/di/app.container.tsx
export const createAppContainer = () => {
	const container = new Container();
	container.bind(ARTICLE_API).to(ArticleApi);
	container.bind(ArticleService).toSelf();
	return container;
};

// pages/articles/index.tsx
export const inject = createModuleInjector([ArticleService]);
```

A low-level API is bound with a symbol token (`ARTICLE_API`). A high-level implementation is bound with its class (`ArticleService`). Server code calls `createRequestContainer(context)` and resolves with `container.get(ArticleService)`. That container is the app bindings plus the Next.js request context.

## Stores

A store is an `@injectable()` class. Reatom atoms live on the class as `private readonly` or `readonly` fields. The store receives its service through `@inject` in the constructor. Atoms are not exported from the slice.

Do not wrap atoms in getter methods on the store. Components read atoms directly (`store.page.data()`, `store.page.ready()`).

For async data, use `computed` with `wrap` and `.extend(withAsyncData({ initState }))`. For SSR, keep a private `serverDataAtom`, expose a `syncFromServer` method, and let the computed return server data when it is set.

```typescript
// features/vacancies/vacancies.store.ts
@injectable()
export class VacanciesStore {
	private readonly serverDataAtom = atom<PageVacancies | null>(null, 'vacancies.serverData');

	readonly page = computed(async () => {
		const serverData = this.serverDataAtom();
		if (serverData !== null) {
			return serverData;
		}
		return await wrap(this.vacanciesService.loadVacanciesPage());
	}, 'vacancies.page').extend(withAsyncData({ initState: emptyPage }));

	constructor(@inject(VacanciesService) private readonly vacanciesService: VacanciesService) {}

	syncFromServer(page: PageVacancies) {
		this.serverDataAtom.set(page);
	}
}
```

Bind the store in `app/di/app.container.tsx` as a singleton next to its service:

```typescript
container.bind(VacanciesService).toSelf().inSingletonScope();
container.bind(VacanciesStore).toSelf().inSingletonScope();
```

The page resolves the store with its own `inject`, syncs SSR data, and passes the instance into the feature `*Injector`. Feature UI reads it with `useDI` from `*.di.ts`.

```tsx
// pages/vacancies.tsx
export const inject = createModuleInjector([VacanciesStore]);

const VacanciesPage = ({ page }: Props) => {
	const vacanciesStore = inject(VacanciesStore);
	vacanciesStore.syncFromServer(page);

	return (
		<VacanciesInjector value={{ vacanciesStore }}>
			<VacanciesEntry />
		</VacanciesInjector>
	);
};
```

```tsx
// features/vacancies/vacancies.di.ts
export const useDI = () => useStrictContext(VacanciesContext);

// features/vacancies/ui/vacancies.component.tsx
export const VacanciesEntry = reatomComponent(() => {
	const { vacanciesStore } = useDI();
	const page = vacanciesStore.page.data();
	const isLoading = !vacanciesStore.page.ready() && page.vacancies.length === 0;

	return (
		<AsyncWrapper loading={isLoading} fallback={<VacanciesLoading />}>
			<VacanciesList vacancies={page.vacancies} />
		</AsyncWrapper>
	);
});
```

### AsyncWrapper

Switch between loading, error, and content with `AsyncWrapper` from `shared/ui`. Do not write the `if` or the ternary in the component. `AsyncWrapper` does not know about Reatom. The `reatomComponent` that reads the store works out the state and passes plain values:

| Prop | Meaning |
| --- | --- |
| `loading` | `true` renders `fallback` |
| `fallback` | Loading UI |
| `error` | Optional. `true` renders `errorFallback` |
| `errorFallback` | Optional. Error UI. Renders nothing when left out |
| `children` | Content, rendered when neither `loading` nor `error` is `true` |

`loading` wins over `error`. Compute `loading` as `!atom.ready()`, or as `!atom.ready() && isEmpty` when SSR data should stay on screen while the atom reloads. For an error state, pass `error={atom.error() !== undefined}`.

### Loading state

Loading state comes from the async atom or action itself: `!atom.ready()` for a `computed` with `withAsyncData`, `!action.ready()` for an `action` with `withAsync`. Do not keep an `isLoading` atom next to it and do not set one by hand around the call. A feature that needs another feature's loading state gets the action (typed as `{ ready: () => boolean }`) through its context, as `order-registration` gets `cartLoad`.

### Mutations

A store holds data. A write that holds no data of its own does not get a store. Put it on the service that owns the data as an `action` with `.extend(withAsync())`. When the write belongs to an entity, that is the entity service. The service reads the payload from the injected stores, calls the API, and reports success or failure through `SnackbarService`. The component calls the action and reads `action.ready()` for the pending state. It does not build the payload and does not call `useSnackbar`.

Bind that service with `inSingletonScope()`, so every consumer shares one action and one pending state. The page resolves the service with its own `inject` and passes it into the feature `*Injector`. Feature UI reads it with `useDI`.

```typescript
// entities/user/user.service.ts
@injectable()
export class UserService implements UserReader {
	readonly saveUserInfo = action(async () => {
		try {
			await wrap(this.updateUserInfo({ username: this.userStore.username /* ... */ }));
			this.snackbarService.success(SAVE_SUCCESS);
		} catch {
			this.snackbarService.error(SAVE_ERROR);
		}
	}, 'user.saveUserInfo').extend(withAsync());

	constructor(
		@inject(USER_API) private readonly userApi: UserApi,
		@inject(UserStore) private readonly userStore: UserStore,
		@inject(SnackbarService) private readonly snackbarService: SnackbarService
	) {}
}
```

The session stores `UserStore`, `CartStore`, and `FavoriteStore` live in their entities as injectable classes bound as singletons. An entity exports the class and no hook. A feature that reads one lists it in its context value. Pages resolve it with their own `inject`. `app` code resolves it with `useInjection`. Services receive it with `@inject(UserStore)`. New stores follow the injectable class shape above. When you touch an old store, migrate it to a class and bind it in the app container.

## Bound context

A feature reads its dependencies only through bound context: `*.context.tsx` defines `XContext` and `XInjector`, and `*.di.ts` exports `useDI`. Whoever renders the feature resolves the dependencies and passes them into `XInjector`:

| Renderer | Resolves with | Example |
| --- | --- | --- |
| A page | its own `export const inject = createModuleInjector([...])` | `pages/profile.tsx` → `ProfileInjector`, `pages/spare-parts/[[...slug]].tsx` → `SparePartsCatalogInjector` |
| `app`, for features used on every page | `useInjection` in `app/providers/FeatureProviders.tsx` | `UserInjector`, `CartInjector`, `FavoritesInjector`, `FooterInjector`, `RouteShieldInjector` |
| The feature itself, only when `_app` renders it | a `*Wrapper` with `createModuleInjector` | `HeaderWrapper` → `HeaderInjector` |

`header` is the only feature that calls `createModuleInjector`. A page component that calls a feature hook itself (`useOrderRegistration`) renders a `*Content` child inside the injector, because the hook needs the context.

`useInjection` accepts only tokens returned by `appContainer.getKeys`. Page and feature code do not import `useInjection` from `shared/di`. Only `app` does.

`@inject(token)` is the other way, on a class that the container constructs.

```tsx
// shared/di/di.hook.ts
export function createModuleInjector<const T extends NonEmptyTokensArray>(tokens: T) {
	const allowed = new Set<AllowedTokens>(tokens);

	return function useInject<Token extends T[number]>(token: Token) {
		if (!allowed.has(token)) {
			throw new Error(/* ... */);
		}
		return useInjection(token);
	};
}
```

```typescript
@injectable()
class HeaderSearch {
	constructor(@inject(TYPES.SparePartSearch) private search: SparePartSearch) {}
}
```

`header` uses bound context through a wrapper, because no page renders it. `features/header/ui/headerWrapper.component.tsx` defines `createModuleInjector([...])`, resolves every store, and renders `Header` inside `HeaderInjector`. `HeaderWrapper` takes no props, and `_app` renders `<HeaderWrapper />`. The feature index exports `HeaderWrapper`, not `Header`. A `*Wrapper` exists only for a feature that `_app` renders.

The header is split into sub-features, the same way `catalog` is. They all read the one `HeaderContext` with `useDI` from `header.di.ts`:

```
features/header/
├── header.store.ts / header.service.ts   # mobile menu, navigation, logout, open auth
├── ports/header.port.ts                  # HEADER_SESSION, HEADER_CATALOG_FILTERS
├── ui/                                   # Header, HeaderWrapper, layout bars, mobile menu drawer
├── search/                               # HeaderSearchStore, HeaderSearchService, search box, history
├── catalogMenu/                          # HeaderCatalogStore, HeaderCatalogService, catalog button and menu
└── userMenu/                             # UserMenuStore, profile button and menu, cart and favorites badges
```

All header state lives in these stores, including menu anchors and dropdown flags. Header components do not use `useState` or react-query. A menu that has several buttons (desktop and mobile layouts) renders once in `Header` (`CatalogMenu`, `UserMenu`, `HeaderMobileMenuModal`), and the buttons only call the store. The search box renders twice, so its outside-click handler ignores the copy hidden by CSS.

| Store | State | Service |
| --- | --- | --- |
| `HeaderStore` | `isMobileMenuOpened` | `HeaderService`: `logout` action with `withAsync`, `openAuth`, `navigate` |
| `HeaderSearchStore` | `searchValue`, `searchHistory`, `isDropdownOpened`, `searchResults` (300 ms `sleep`, reruns on catalog filters), `sparePartsTotal`, `placeholder` | `HeaderSearchService`: search request, total, placeholder text, history rules and local storage |
| `HeaderCatalogStore` | `menuAnchor`, `activeCategory`, `topCategories` (lazy `computed` with `withAsyncData`, read only inside the open popover) | `HeaderCatalogService`: top categories request, mobile catalog navigation |
| `UserMenuStore` | `menuAnchor` | uses `HeaderService` |

What the header needs from other features goes through ports, bound in `app/di/header.adapters.tsx`:

| Token | Port | Bound in `app` to |
| --- | --- | --- |
| `HEADER_SESSION` | `HeaderSession`: `logout()`, `openAuth()` | `HeaderSessionAdapter`: `ProfileService.logout`, `AuthModalStore.open` |
| `HEADER_CATALOG_FILTERS` | `HeaderCatalogFilters`: `getFilters()` | `HeaderCatalogFiltersAdapter`: spare parts filters while the catalog is mounted, otherwise `{}` |

The app has one auth modal. `AuthModalStore` in `features/user` holds its state and opens it for a reset-password link. `_app` renders `<AuthModalRoot onLoginSuccess={...} />` once. The header opens it through `HEADER_SESSION`, and the footer through `openAuth` in `FooterContext`, which `FeatureProviders` fills. `WorkTimetable` is plain UI and lives in `shared/ui`.

`AppDiProvider` wraps the whole tree from `pages/_app.tsx`.

## Guest and signed-in storage

When the same data lives in the API for a signed-in user and in local storage for a guest, do not branch on the user in every action. The entity owns one API interface and two implementations. The feature service chooses between them in one getter:

```
entities/cart/
├── cart.api.ts                 # interface CartApi: load, add, remove, removeMany
├── remoteCart.api.ts           # RemoteCartApi: HTTP + DTO mapping, user from SessionStore
├── localCart.api.ts            # LocalCartApi: local storage, getStored(), products through CART_PRODUCTS
└── ports/cartProducts.port.ts  # CART_PRODUCTS: findStored(items) → fresh products
features/cart/cartList.service.ts  # private get api() → remote or local
```

```typescript
// features/cart/cartList.service.ts
private get api(): CartApi {
	return this.sessionStore.isAuth() ? this.remote : this.local;
}
```

- **Who is signed in** comes from `SessionStore` in `core/session`: a `userId` atom, an `isAuth` computed, and `set` / `clear`. `UserStore` calls them when the user signs in or out. Entities and features read the session there and never import `UserStore` for it.
- **Guest products:** `LocalCartApi` needs products from other entities, so the entity asks through its own port (`CART_PRODUCTS`, `FAVORITE_PRODUCTS`). `app/di/storedProducts.adapter.ts` implements both with `fetchProductsByType` and the product services.
- **When the choice happens:** on every call, not in the Inversify binding, because a binding resolves once and the user signs in and out while the app runs.

`favorites` has the same shape: `FavoriteApi`, `RemoteFavoriteApi`, and `LocalFavoriteApi` in `entities/favorite`, and `FavoriteListService` in the feature.

## Sub-features

A feature that composes several capabilities, and is rendered as one block, may split into sub-features. `header` (`search`, `catalogMenu`, `userMenu`) and `catalog` (`spareParts`, `cabins`, `tires`, `wheels`) do this. There is no `widgets` layer, and separate features could not compose each other, so this is the place for a composite block.

- A sub-feature is a folder with its own `index.ts`, stores, services, and `ui/`.
- A sub-feature depends only on the feature root (`header.di.ts`, `ports/`, root services) and on its own files. It never imports a sibling sub-feature.
- Only the root composes sub-features, and it imports each one through its `index.ts`.
- Code outside the feature imports only the feature `index.ts`, never a sub-feature path.
- Sub-features share the root context unless they need isolation. Then each gets its own `*Injector`, nested in the root wrapper or page.
- When something outside the feature needs a sub-feature, promote it to a top-level feature and give the old owner a port.

`eslint.config.mjs` enforces the header rules with `subFeatureOverrides('src/features/header', headerSubFeatures)`: a sibling import and a deep import from the root into a sub-feature are both errors. Add a feature there when it gets sub-features.

## What a feature or entity may not do

- value-import another feature or entity (`import { cartStore } from 'features/cart/cartStore'`)
- import `pages` or `app`
- let an entity import a feature
- export the DTO, Reatom atoms, or a container from an entity `index.ts`
- import an API file from outside its slice (`entities/brand/brandApi`); use the slice index
- render a second `DiProvider` inside a feature or page. Bindings are added in `app/di/app.container.tsx`

Type-only imports of a model from `entities/<name>`, or of a port from `features/<name>` or `entities/<name>`, are allowed. That is the public contract. A DTO is not part of that contract.

## Shared

`shared` stays the technical layer: `ui`, `api`, `hooks`, `services`, `icons`, `utils`.

It does not import features or entities, does not hold product DTOs or models, and does not receive Inversify bindings for product ports. The HTTP client in `shared/api` is infrastructure. An entity wraps it behind a port when another slice must call that data.

## Tests

Construct a container in the test, bind the ports to fakes, and render the feature with that container. Do not mock a sibling feature's file path.
