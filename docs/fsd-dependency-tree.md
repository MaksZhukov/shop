# FSD dependency tree (cross-slice imports)

Includes both runtime imports and type-only imports/exports, including cross-slice `export … from` re-exports in public API (`index.ts`) files.
Entries marked `(type-only)` are used only for TypeScript types.
Same-slice internal imports are omitted. `(root)` means files directly under layer root.

## app/(root)
  → app/providers
  → shared/api (type-only)
  → shared/services

## app/providers
  → entities/cart
  → entities/favorite
  → entities/user
  → features/sparePartsCatalog
  → features/user
  → shared/api
  → shared/hooks
  → shared/services

## widgets/benefits
  → entities/sparePart
  → features/mainPage
  → shared/api
  → shared/ui
  → shared/utils

## widgets/cart
  → entities/cart (type-only)
  → entities/product
  → features/favorites
  → shared/icons
  → shared/ui

## widgets/catalog
  → entities/brand (type-only)
  → entities/catalog
  → entities/kindSparePart (type-only)
  → entities/page (type-only)
  → entities/product
  → features/cabinsCatalog
  → features/cart
  → features/favorites
  → features/productFilters
  → features/sparePartsCatalog
  → features/tiresCatalog
  → features/wheelsCatalog
  → shared/api (type-only)
  → shared/icons
  → shared/ui

## widgets/footer
  → shared/ui

## widgets/gallery
  → entities/page (type-only)
  → shared/api (type-only)
  → shared/services
  → shared/ui

## widgets/header
  → entities/cart
  → entities/catalog
  → entities/sparePart
  → entities/user
  → features/cart
  → features/favorites
  → features/mobileContacts
  → features/sparePartsCatalog
  → features/user
  → features/workTimetable
  → shared/icons
  → shared/services
  → shared/ui
  → shared/utils

## widgets/main
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
  → features/cart
  → features/favorites
  → features/mainPage
  → shared/api
  → shared/constants
  → shared/hooks
  → shared/icons
  → shared/services
  → shared/ui
  → widgets/benefits

## widgets/orderRegistration
  → features/mobileContacts
  → features/orderRegistration
  → shared/ui

## widgets/product
  → entities/page (type-only)
  → entities/product
  → features/cart
  → features/favorites
  → features/share
  → shared/icons
  → shared/ui
  → widgets/gallery

## features/articlesList
  → entities/article
  → shared/api (type-only)
  → shared/icons
  → shared/ui

## features/buy
  → entities/order
  → entities/product (type-only)
  → shared/ui

## features/cabinsCatalog
  → entities/brand
  → entities/cabin
  → entities/generation
  → entities/kindSparePart
  → entities/model
  → entities/page
  → entities/product
  → features/productFilters
  → shared/api
  → shared/constants
  → shared/services

## features/cart
  → entities/cabin
  → entities/cart
  → entities/product (type-only)
  → entities/sparePart
  → entities/tire
  → entities/user
  → entities/wheel
  → shared/api (type-only)

## features/favorites
  → entities/cabin
  → entities/favorite
  → entities/product (type-only)
  → entities/sparePart
  → entities/tire
  → entities/user
  → entities/wheel
  → shared/api (type-only)
  → shared/icons

## features/mainPage
  → entities/article
  → entities/brand
  → entities/carOnParts
  → entities/sparePart
  → shared/api

## features/mobileContacts
  → features/workTimetable
  → shared/ui

## features/orderRegistration
  → entities/cart
  → entities/order
  → entities/user
  → features/cart
  → shared/icons
  → shared/ui

## features/product
  → entities/product
  → entities/sparePart
  → features/cart
  → features/favorites
  → shared/ui

## features/productFilters
  → shared/icons
  → shared/ui

## features/routeShield
  → entities/user
  → shared/constants
  → shared/ui

## features/scrollUp
  → shared/icons

## features/share
  → shared/icons

## features/sparePartsCatalog
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
  → features/productFilters
  → shared/api
  → shared/constants
  → shared/services

## features/tiresCatalog
  → entities/catalog (type-only)
  → entities/page
  → entities/product
  → entities/tire
  → entities/tireBrand
  → entities/tireDiameter
  → entities/tireHeight
  → entities/tireWidth
  → features/productFilters
  → shared/api
  → shared/services

## features/user
  → entities/user
  → features/cart
  → features/favorites
  → shared/icons
  → shared/services
  → shared/ui

## features/wheelsCatalog
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
  → features/productFilters
  → shared/api
  → shared/services

## features/workTimetable
  → shared/icons
  → shared/ui
  → shared/utils

## entities/article
  → shared/api
  → shared/ui

## entities/autocomise
  → shared/api

## entities/brand
  → shared/api
  → shared/ui

## entities/cabin
  → entities/brand (type-only)
  → entities/generation (type-only)
  → entities/kindSparePart (type-only)
  → entities/model (type-only)
  → entities/order (type-only)
  → entities/product (type-only)
  → shared/api

## entities/car
  → entities/brand (type-only)
  → entities/engineVolume (type-only)
  → entities/generation (type-only)
  → entities/model (type-only)
  → shared/api

## entities/carOnParts
  → entities/brand (type-only)
  → entities/car (type-only)
  → entities/engineVolume (type-only)
  → entities/generation (type-only)
  → entities/model (type-only)
  → shared/api
  → shared/ui

## entities/cart
  → entities/product (type-only)
  → shared/api
  → shared/services

## entities/catalog
  → shared/api

## entities/email
  → shared/api

## entities/engineVolume
  → shared/api

## entities/favorite
  → entities/cabin
  → entities/product
  → entities/sparePart
  → entities/tire
  → entities/user
  → entities/wheel
  → shared/api
  → shared/services

## entities/generation
  → entities/brand (type-only)
  → entities/model (type-only)
  → shared/api

## entities/kindSparePart
  → shared/api

## entities/model
  → entities/brand (type-only)
  → entities/generation (type-only)
  → shared/api

## entities/order
  → entities/product (type-only)
  → shared/api
  → shared/services

## entities/page
  → entities/autocomise (type-only)
  → entities/serviceStation (type-only)
  → shared/api
  → shared/services

## entities/product
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

## entities/review
  → shared/api

## entities/serviceStation
  → shared/api

## entities/sparePart
  → entities/brand (type-only)
  → entities/car (type-only)
  → entities/engineVolume (type-only)
  → entities/generation (type-only)
  → entities/kindSparePart (type-only)
  → entities/model (type-only)
  → entities/product (type-only)
  → shared/api

## entities/tire
  → entities/order (type-only)
  → entities/product (type-only)
  → entities/tireBrand (type-only)
  → entities/tireDiameter (type-only)
  → entities/tireHeight (type-only)
  → entities/tireWidth (type-only)
  → shared/api

## entities/tireBrand
  → entities/brand
  → shared/api

## entities/tireDiameter
  → shared/api

## entities/tireHeight
  → shared/api

## entities/tireWidth
  → shared/api

## entities/user
  → shared/api

## entities/wheel
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

## entities/wheelDiameter
  → shared/api

## entities/wheelDiameterCenterHole
  → shared/api

## entities/wheelDiskOffset
  → shared/api

## entities/wheelNumberHole
  → shared/api

## entities/wheelWidth
  → shared/api

## shared/api
  → shared/services

## shared/services
  → shared/fonts

## shared/ui
  → entities/autocomise
  → entities/serviceStation
  → shared/api (type-only)
  → shared/icons
  → shared/services

## shared/utils
  → entities/page
  → shared/api

---

## Layer → layers (summary)

**app** → app (cross-segment, e.g. `(root)` → `providers`), entities, features, shared
**widgets** → entities, features, shared, widgets
**features** → entities, features, shared
**entities** → entities, features, shared
**shared** → entities, shared
