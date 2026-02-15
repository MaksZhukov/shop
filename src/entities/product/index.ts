export type { Product, ProductType, ViewedProduct, ProductSnippets } from './productTypes';
export { SLUG_PRODUCT_TYPE, CART_ITEM_IMAGE_WIDTH, CART_ITEM_IMAGE_HEIGHT } from './productConstants';
export { isTire, isSparePart, isTireBrand, isWheel, isCabin } from './productGuards';
export { getProductTypeSlug, getProductPageSeo, getProductLink, getProductDetails } from './productUtils';
export type { ProductDescriptionItem } from './productDescription';
export { getProductDescriptionItems } from './productDescription';
export { ProductViewedLocalStorage, productViewedLocalStorage } from './productViewedLocalStorage';
export { ProductPrice, ProductItemImages, ProductItem } from './ui';
