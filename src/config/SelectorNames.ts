export interface ISelectorNames {
  PRICE: string;
  PRICE_DISCOUNT: string;
  LOGIN_EMAIL: string;
  LOGIN_PASSWORD: string;
  LOGIN_BUTTON: string;
}

const SelectorNames: ISelectorNames = {
  PRICE: ".product-price-container .product-price-amount",
  PRICE_DISCOUNT: ".product-price-container span.you-pay-value",
  LOGIN_EMAIL: "#j_username",
  LOGIN_PASSWORD: "#j_password",
  LOGIN_BUTTON: "#loginSubmit",
};

export default SelectorNames;
