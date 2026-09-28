# Architecture

Layers are `app`, `pages`, `features`, `entities`, and `shared`. There is no `widgets` layer.

Cross-feature and cross-entity work goes through an InversifyJS IoC container. The data that crosses that boundary is a model owned by the entity. A DTO exists only at the HTTP edge and is mapped into that model inside the entity.

`widgets/` is still on disk. It is not part of this architecture. When you change a widget, move it into the owning feature. Do not add a new folder under `widgets/`.

## Layers

| Layer | Role | May import |
| --- | --- | --- |
| `app` | Startup, app-wide providers, and the one IoC container | `pages`, `features`, `entities`, `shared` |
| `pages` | One route. Compose feature UI. Load data for that route | `features` and `entities` public API, `shared` |
| `features` | One product capability: UI and behavior | `entities` public API, `shared`. Other features only by injected ports |
| `entities` | One domain object: DTO, model, port, and the implementation behind that port | `shared`. Other entities only by injected ports |
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

A feature `index.ts` exports the component, the store class, and the bound-context pieces (`*Injector`, `useDI`). `app/di/app.container.tsx` writes every `container.bind(TOKEN).to(Impl)`. `pages/_app.tsx` renders `AppDiProvider`. The page defines `inject` with `createModuleInjector([StoreClass])` and passes only tokens listed in that array. An entity `index.ts` exports the model, the port, and the implementation class. When another slice still fetches through the API client, the index exports that client too. After a port replaces the client, the index stops exporting the API. It does not export the DTO, Reatom atoms, or a container.

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

`app/di/app.container.tsx` creates one container and writes every `container.bind` there. `pages/_app.tsx` renders that provider around the tree. A feature does not create the provider. It narrows the global container with `createModuleInjector`, so `inject` accepts only that feature's tokens. The entity does not create a container and does not bind.

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

// features/articlesList/articlesList.di.ts
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

The page resolves the store, syncs SSR data, and passes the instance into the feature context. Feature UI reads the store through `useDI`, not through props.

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
// features/vacancies/ui/vacancies.component.tsx
export const VacanciesEntry = reatomComponent(() => {
	const { vacanciesStore } = useDI();
	const page = vacanciesStore.page.data();
	const isLoading = !vacanciesStore.page.ready() && page.vacancies.length === 0;
	// ...
});
```

`cart`, `user`, and `favorite` still use the older module-level object store (`cartStore`, `useCartStore`). New stores follow the injectable class shape above. When you touch an old store, migrate it to a class and bind it in the app container.

## Bound context

The page resolves dependencies with `inject` and passes them into a feature `*Injector`. Feature UI reads them with `useDI`. `useInjection` accepts only tokens returned by `appContainer.getKeys`. `createModuleInjector([...tokens])` narrows that list at the type level and at runtime. Page and feature code do not import `useInjection` from `shared/di`.

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

The cart badge still reads `useCartStore` and has no port. `AppDiProvider` wraps the whole tree from `pages/_app.tsx`.

Bindings that need a React hook (router, snackbar, Query client) are created in `app` and registered there. The feature depends on the port, not on `next/router` or `notistack`, when that call exists so another feature can be swapped in tests.

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
