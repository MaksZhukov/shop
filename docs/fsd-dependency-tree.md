# FSD dependency tree (cross-slice imports)

Includes both runtime imports and type-only imports/exports.
Entries marked `(type-only)` are used only for TypeScript types.
Same-slice internal imports are omitted. `(root)` means files directly under layer root.

## app/(root)
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
  → entities/product (type-only)
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
  → features/sparePartsCatalog
  → features/user
  → features/workTimetable
  → shared/icons
  → shared/services
  → shared/ui
  → shared/utils

## widgets/main
  → entities/article (type-only)
  → entities/brand (type-only)
  → entities/car
  → entities/carOnParts (type-only)
  → entities/engineVolume
  → entities/generation (type-only)
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
  → features/orderRegistration
  → shared/ui

## widgets/product
  → entities/page (type-only)
  → entities/product (type-only)
  → features/cart
  → features/favorites
  → features/share
  → shared/icons
  → shared/ui
  → widgets/gallery

## features/articlesList
  → entities/article (type-only)
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
  → entities/generation (type-only)
  → entities/kindSparePart
  → entities/model
  → entities/page (type-only)
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

## features/orderRegistration
  → app/providers
  → entities/cart (type-only)
  → entities/order
  → entities/user
  → features/cart
  → shared/icons
  → shared/ui
  → widgets/header

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
  → entities/generation (type-only)
  → entities/kindSparePart
  → entities/model
  → entities/page (type-only)
  → entities/product
  → entities/sparePart
  → features/productFilters
  → shared/api
  → shared/constants
  → shared/services

## features/tiresCatalog
  → entities/catalog (type-only)
  → entities/page (type-only)
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
  → app/providers
  → entities/user
  → features/cart
  → features/favorites
  → shared/icons
  → shared/services
  → shared/ui

## features/wheelsCatalog
  → entities/brand
  → entities/model
  → entities/page (type-only)
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
  → shared/api (type-only)
  → shared/ui

## entities/autocomise
  → shared/api (type-only)

## entities/brand
  → shared/api (type-only)
  → shared/ui

## entities/cabin
  → entities/brand (type-only)
  → entities/generation (type-only)
  → entities/kindSparePart (type-only)
  → entities/model (type-only)
  → entities/order (type-only)
  → entities/product (type-only)
  → shared/api (type-only)

## entities/car
  → entities/brand (type-only)
  → entities/engineVolume (type-only)
  → entities/generation (type-only)
  → entities/model (type-only)
  → shared/api (type-only)

## entities/carOnParts
  → entities/brand (type-only)
  → entities/car (type-only)
  → entities/engineVolume (type-only)
  → entities/generation (type-only)
  → entities/model (type-only)
  → shared/api (type-only)
  → shared/ui

## entities/cart
  → entities/product (type-only)
  → shared/api (type-only)
  → shared/services

## entities/catalog
  → shared/api (type-only)

## entities/email
  → shared/api

## entities/engineVolume
  → shared/api (type-only)

## entities/favorite
  → entities/cabin
  → entities/product
  → entities/sparePart
  → entities/tire
  → entities/user
  → entities/wheel
  → shared/api (type-only)
  → shared/services

## entities/generation
  → entities/brand (type-only)
  → entities/model (type-only)
  → shared/api (type-only)

## entities/kindSparePart
  → shared/api (type-only)

## entities/model
  → entities/brand (type-only)
  → entities/generation (type-only)
  → shared/api (type-only)

## entities/order
  → entities/product (type-only)
  → features/orderRegistration (type-only)
  → shared/api (type-only)
  → shared/services

## entities/page
  → entities/autocomise (type-only)
  → entities/serviceStation (type-only)
  → shared/api (type-only)
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
  → shared/api (type-only)

## entities/serviceStation
  → shared/api (type-only)

## entities/sparePart
  → entities/brand (type-only)
  → entities/car (type-only)
  → entities/engineVolume (type-only)
  → entities/generation (type-only)
  → entities/kindSparePart (type-only)
  → entities/model (type-only)
  → entities/product (type-only)
  → shared/api (type-only)

## entities/tire
  → entities/order (type-only)
  → entities/product (type-only)
  → entities/tireBrand (type-only)
  → entities/tireDiameter (type-only)
  → entities/tireHeight (type-only)
  → entities/tireWidth (type-only)
  → shared/api (type-only)

## entities/tireBrand
  → entities/brand
  → shared/api (type-only)

## entities/tireDiameter
  → shared/api (type-only)

## entities/tireHeight
  → shared/api (type-only)

## entities/tireWidth
  → shared/api (type-only)

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
  → shared/api (type-only)

## entities/wheelDiameter
  → shared/api (type-only)

## entities/wheelDiameterCenterHole
  → shared/api (type-only)

## entities/wheelDiskOffset
  → shared/api (type-only)

## entities/wheelNumberHole
  → shared/api (type-only)

## entities/wheelWidth
  → shared/api (type-only)

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

**app** → entities, features, shared
**widgets** → entities, features, shared, widgets
**features** → app, entities, features, shared, widgets
**entities** → entities, features, shared
**shared** → entities, shared
