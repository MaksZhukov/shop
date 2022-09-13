export const saveJwt = (jwt: string) => {
  localStorage.setItem("token", jwt);
};

export const getJwt = (): string | null => {
  return localStorage.getItem("token");
};

export const getFavoriteProductIDs = (): {
  spareParts: number[];
  wheels: number[];
  tires: number[];
} => {
  let result = localStorage.getItem("favoriteProductIDs");
  return result
    ? JSON.parse(result)
    : { spareParts: [], wheels: [], tires: [] };
};

export const saveFavoriteProductID = (
  productTypeID: "spareParts" | "wheels" | "tires",
  id: number
) => {
  let productIDs = getFavoriteProductIDs();
  productIDs[productTypeID].push(id);
  localStorage.setItem("favoriteProductIDs", JSON.stringify(productIDs));
};

export const removeFavoriteProductID = (
  productTypeID: "spareParts" | "wheels" | "tires",
  id: number
) => {
  let productIDs = getFavoriteProductIDs();
  productIDs[productTypeID] = productIDs[productTypeID].filter(
    (productID) => productID !== id
  );
  localStorage.setItem("favoriteProductIDs", JSON.stringify(productIDs));
};

export const getCartProductIDs = (): {
  spareParts: number[];
  wheels: number[];
  tires: number[];
} => {
  let result = localStorage.getItem("cartProductIDs");
  return result
    ? JSON.parse(result)
    : { spareParts: [], wheels: [], tires: [] };
};

export const saveCartProductID = (
  productTypeID: "spareParts" | "wheels" | "tires",
  id: number
) => {
  let productIDs = getCartProductIDs();
  productIDs[productTypeID].push(id);
  localStorage.setItem("cartProductIDs", JSON.stringify(productIDs));
};

export const removeCartProductID = (
  productTypeID: "spareParts" | "wheels" | "tires",
  id: number
) => {
  let productIDs = getFavoriteProductIDs();
  productIDs[productTypeID] = productIDs[productTypeID].filter(
    (productID) => productID !== id
  );
  localStorage.setItem("cartProductIDs", JSON.stringify(productIDs));
};

export const saveIsReviewAdded = (value: boolean) => {
  localStorage.setItem("isReviewAdded", `${value}`);
};

export const getIsReviewAdded = (): boolean => {
  let result = localStorage.getItem("isReviewAdded");
  return result ? JSON.parse(result) : false;
};

export const saveReviewEmail = (email: string) => {
  localStorage.setItem("reviewEmail", email);
};

export const getReviewEmail = (): string => {
  return localStorage.getItem("reviewEmail") || "";
};
