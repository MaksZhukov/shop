# FSD dependency tree (cross-slice imports)

Includes both runtime imports and type-only imports/exports, including cross-slice `export … from` re-exports in public API (`index.ts`) files.
Entries marked `(type-only)` are used only for TypeScript types.
Same-slice internal imports are omitted. `(root)` means files directly under layer root.

Within each slice, dependency lines are ordered **app → pages → widgets → features → entities → shared** (alphabetically within the same layer).

**Entity `model/` segment:** Domain types live under `entities/<slice>/model/` (e.g. `brand/model/brandModel.ts`), same pattern as `entities/article/model/articleModel.ts`. The car-catalog **slice** named `model` uses `entities/model/model/types.ts` to avoid a `modelModel` filename. **Consumers** (pages, widgets, features, app, other entity slices) import only from the slice public API: `entities/<slice>` (root `index.ts`). Inside the same slice, use relative paths (`./model/…`, `./ui/…`) so barrels do not create circular imports.

## ESLint boundaries (`boundaries/dependencies`)

Rules live in `eslint.config.mjs` (`fsdElements`, `fsdDependencyRules`).

- **app**: must not import `pages` or `widgets` (see `eslint.config.mjs`).
- **pages**: no slice-specific `boundaries` entries beyond normal FSD layering; composition lives here.
- **widgets**: no **value** imports from `widgets/<otherSlice>/…` (same slice allowed); must not import `pages` or `app`. Compose via **pages**, **features**, or **shared**.
- **features**: no **value** imports across feature slices; **type-only** imports are allowed; must not import `app`, `pages`, or `widgets`. **Exception**: `features/mobileContacts` may value-import `features/workTimetable` (explicit allow rule).
- **entities**: no **value** imports across entity slices; **type-only** imports from other entities are allowed; must not import `app`, `pages`, `widgets`, or `features`.
- **shared**: must not import domain layers (`app` / `pages` / `widgets` / `features` / `entities`).

---

## App

### app/(root)

→ app/providers  
→ shared/api (type-only)  
→ shared/services

### app/hooks

(`useInitialAuthLoad` — bootstraps user, cart, and favorites after mount.)

→ features/cart  
→ features/favorites  
→ features/user  
→ entities/user

### app/providers

→ features/sparePartsCatalog  
→ features/user  
→ entities/cart  
→ entities/favorite  
→ entities/user  
→ shared/api  
→ shared/hooks  
→ shared/services

## Pages

### pages/\_app (composition)

→ app/hooks (`useInitialAuthLoad`)  
→ app/providers (`ApiProvider`, `QueryProvider`, `RecaptchaProvider`, `SnackbarProvider`, `StoreProvider`, `ThemeProvider`)  
→ app (`HeadSEO` from barrel)  
→ widgets/footer  
→ widgets/header  
→ features/routeShield  
→ features/scrollUp  
→ shared/ui

## Widgets

### widgets/benefits

→ features/mainPage  
→ entities/sparePart  
→ shared/api  
→ shared/ui  
→ shared/utils

### widgets/cart

→ features/favorites  
→ entities/cart (type-only)  
→ entities/product  
→ shared/icons  
→ shared/ui

### widgets/catalog

→ features/cabinsCatalog  
→ features/cart  
→ features/favorites  
→ features/productFilters  
→ features/sparePartsCatalog  
→ features/tiresCatalog  
→ features/wheelsCatalog  
→ entities/brand (type-only)  
→ entities/catalog  
→ entities/kindSparePart (type-only)  
→ entities/page (type-only)  
→ entities/product  
→ shared/api (type-only)  
→ shared/icons  
→ shared/ui

### widgets/footer

→ features/cart  
→ features/favorites  
→ features/user  
→ entities/user  
→ shared/ui

### widgets/gallery

→ entities/page (type-only)  
→ shared/api (type-only)  
→ shared/services  
→ shared/ui (`GalleryImages` implementation lives under `shared/ui/GalleryImages`)

### widgets/header

→ features/cart  
→ features/favorites  
→ features/mobileContacts  
→ features/sparePartsCatalog  
→ features/user  
→ features/workTimetable  
→ entities/cart  
→ entities/catalog  
→ entities/sparePart  
→ entities/user  
→ shared/icons  
→ shared/services  
→ shared/ui  
→ shared/utils

### widgets/main

→ features/cart  
→ features/favorites  
→ features/mainPage  
→ entities/article  
→ entities/brand  
→ entities/car  
→ entities/carOnParts  
→ entities/engineVolume  
→ entities/generation  
→ entities/kindSparePart  
→ entities/model  
→ entities/product  
→ entities/sparePart  
→ shared/api  
→ shared/constants  
→ shared/hooks  
→ shared/icons  
→ shared/services  
→ shared/ui

### widgets/orderRegistration

→ features/cart  
→ features/mobileContacts  
→ features/orderRegistration  
→ shared/ui

### widgets/product

→ features/cart  
→ features/favorites  
→ features/share  
→ entities/page (type-only)  
→ entities/product  
→ shared/icons  
→ shared/ui (GalleryImages)

### widgets/viewedProducts

→ features/cart  
→ features/favorites  
→ entities/product  
→ entities/sparePart  
→ shared/ui

## Features

### features/articlesList

→ entities/article  
→ shared/api (type-only)  
→ shared/icons  
→ shared/ui

### features/buy

→ entities/order  
→ entities/product (type-only)  
→ shared/ui

### features/cabinsCatalog

→ features/productFilters (type-only)  
→ entities/brand  
→ entities/cabin  
→ entities/generation  
→ entities/kindSparePart  
→ entities/model  
→ entities/page  
→ entities/product  
→ shared/api  
→ shared/constants  
→ shared/services

### features/cart

→ entities/cabin  
→ entities/cart  
→ entities/product (type-only)  
→ entities/sparePart  
→ entities/tire  
→ entities/user  
→ entities/wheel  
→ shared/api (type-only)

### features/favorites

→ entities/cabin  
→ entities/favorite  
→ entities/product (type-only)  
→ entities/sparePart  
→ entities/tire  
→ entities/user  
→ entities/wheel  
→ shared/api (type-only)  
→ shared/icons

### features/mainPage

→ entities/article  
→ entities/brand  
→ entities/carOnParts  
→ entities/sparePart  
→ shared/api

### features/mobileContacts

→ features/workTimetable  
→ shared/ui

### features/orderRegistration

→ entities/cart  
→ entities/order  
→ entities/user  
→ shared/icons  
→ shared/ui

### features/productFilters

→ shared/icons  
→ shared/ui

### features/routeShield

→ entities/user  
→ shared/constants  
→ shared/ui

### features/scrollUp

→ shared/icons

### features/share

→ shared/icons

### features/sparePartsCatalog

→ features/productFilters (type-only)  
→ entities/brand  
→ entities/car  
→ entities/catalog  
→ entities/engineVolume  
→ entities/generation  
→ entities/kindSparePart  
→ entities/model  
→ entities/page  
→ entities/product  
→ entities/sparePart  
→ shared/api  
→ shared/constants  
→ shared/services

### features/tiresCatalog

→ features/productFilters (type-only)  
→ entities/catalog (type-only)  
→ entities/page  
→ entities/product  
→ entities/tire  
→ entities/tireBrand  
→ entities/tireDiameter  
→ entities/tireHeight  
→ entities/tireWidth  
→ shared/api  
→ shared/services

### features/user

→ entities/user  
→ shared/icons  
→ shared/services  
→ shared/ui

### features/wheelsCatalog

→ features/productFilters (type-only)  
→ entities/brand  
→ entities/model  
→ entities/page  
→ entities/product  
→ entities/wheel  
→ entities/wheelDiameter  
→ entities/wheelDiameterCenterHole  
→ entities/wheelDiskOffset  
→ entities/wheelNumberHole  
→ entities/wheelWidth  
→ shared/api  
→ shared/services

### features/workTimetable

→ shared/icons  
→ shared/ui  
→ shared/utils

## Entities

### entities/article

→ shared/api  
→ shared/ui

### entities/autocomise

→ shared/api

### entities/brand

→ shared/api  
→ shared/ui

### entities/cabin

→ entities/brand (type-only)  
→ entities/generation (type-only)  
→ entities/kindSparePart (type-only)  
→ entities/model (type-only)  
→ entities/order (type-only)  
→ entities/product (type-only)  
→ shared/api

### entities/car

→ entities/brand (type-only)  
→ entities/engineVolume (type-only)  
→ entities/generation (type-only)  
→ entities/model (type-only)  
→ shared/api

### entities/carOnParts

→ entities/brand (type-only)  
→ entities/car (type-only)  
→ entities/engineVolume (type-only)  
→ entities/generation (type-only)  
→ entities/model (type-only)  
→ shared/api  
→ shared/ui

### entities/cart

→ entities/product (type-only)  
→ shared/api  
→ shared/services

### entities/catalog

→ shared/api

### entities/email

→ shared/api

### entities/engineVolume

→ shared/api

### entities/favorite

→ entities/product (type-only)  
→ shared/api  
→ shared/services

### entities/generation

→ entities/brand (type-only)  
→ entities/model (type-only)  
→ shared/api

### entities/kindSparePart

→ shared/api

### entities/model

→ entities/brand (type-only)  
→ entities/generation (type-only)  
→ shared/api

### entities/order

→ entities/product (type-only)  
→ shared/api  
→ shared/services

### entities/page

→ entities/autocomise (type-only)  
→ entities/serviceStation (type-only)  
→ shared/api  
→ shared/services

### entities/product

→ entities/brand (type-only)  
→ entities/cabin (type-only)  
→ entities/sparePart  
→ entities/tire  
→ entities/tireBrand  
→ entities/wheel  
→ shared/api (type-only)  
→ shared/services  
→ shared/ui  
→ shared/utils

### entities/review

→ shared/api

### entities/serviceStation

→ shared/api

### entities/sparePart

→ entities/brand (type-only)  
→ entities/car (type-only)  
→ entities/engineVolume (type-only)  
→ entities/generation (type-only)  
→ entities/kindSparePart (type-only)  
→ entities/model (type-only)  
→ entities/product (type-only)  
→ shared/api

### entities/tire

→ entities/order (type-only)  
→ entities/product (type-only)  
→ entities/tireBrand (type-only)  
→ entities/tireDiameter (type-only)  
→ entities/tireHeight (type-only)  
→ entities/tireWidth (type-only)  
→ shared/api

### entities/tireBrand

→ entities/brand (type-only)  
→ shared/api

### entities/tireDiameter

→ shared/api

### entities/tireHeight

→ shared/api

### entities/tireWidth

→ shared/api

### entities/user

→ shared/api

### entities/wheel

→ entities/brand (type-only)  
→ entities/model (type-only)  
→ entities/order (type-only)  
→ entities/product (type-only)  
→ entities/wheelDiameter (type-only)  
→ entities/wheelDiameterCenterHole (type-only)  
→ entities/wheelDiskOffset (type-only)  
→ entities/wheelNumberHole (type-only)  
→ entities/wheelWidth (type-only)  
→ shared/api

### entities/wheelDiameter

→ shared/api

### entities/wheelDiameterCenterHole

→ shared/api

### entities/wheelDiskOffset

→ shared/api

### entities/wheelNumberHole

→ shared/api

### entities/wheelWidth

→ shared/api

## Shared

### shared/api

→ shared/services

### shared/services

→ shared/fonts

### shared/ui

→ shared/api (type-only)  
→ shared/icons  
→ shared/services

### shared/utils

→ shared/api

---

## Layer → layers (summary)

Order: **app** → **pages** → **widgets** → **features** → **entities** → **shared**.

**app** → app (providers, hooks, cross-segment), entities, features, shared  
**pages** → app, features, shared, widgets  
**widgets** → entities, features, shared (no cross-widget value imports; see ESLint note above)  
**features** → entities, shared; cross-feature value imports forbidden except `mobileContacts` → `workTimetable` (see ESLint note above)  
**entities** → entities (type-only across slices where needed), shared  
**shared** → shared
