const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

const endpoint = `https://${domain}/api/2025-04/graphql.json`;

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage;
  images: { edges: { node: ShopifyImage }[] };
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  variants: { edges: { node: ShopifyProductVariant }[] };
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { title: string; featuredImage: ShopifyImage };
    price: { amount: string; currencyCode: string };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  estimatedCost: {
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: { edges: { node: CartLine }[] };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    featuredImage { url altText width height }
    images(first: 6) { edges { node { url altText width height } } }
    priceRange { minVariantPrice { amount currencyCode } }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          price { amount currencyCode }
        }
      }
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    estimatedCost { totalAmount { amount currencyCode } }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              product {
                title
                featuredImage { url altText width height }
              }
            }
          }
        }
      }
    }
  }
`;

// ─── Product fetches ──────────────────────────────────────────────────────────

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(
    `
    ${PRODUCT_FRAGMENT}
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        ...ProductFields
      }
    }
  `,
    { handle }
  );
  return data.productByHandle;
}

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>(
    `
    ${PRODUCT_FRAGMENT}
    query GetProducts {
      products(first: 20) {
        edges { node { ...ProductFields } }
      }
    }
  `
  );
  return data.products.edges.map((e) => e.node);
}

// ─── Cart mutations ───────────────────────────────────────────────────────────

export async function createCart(): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>(
    `
    ${CART_FRAGMENT}
    mutation CartCreate {
      cartCreate {
        cart { ...CartFields }
      }
    }
  `
  );
  return data.cartCreate.cart;
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>(
    `
    ${CART_FRAGMENT}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
      }
    }
  `,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] }
  );
  return data.cartLinesAdd.cart;
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>(
    `
    ${CART_FRAGMENT}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
      }
    }
  `,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>(
    `
    ${CART_FRAGMENT}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
      }
    }
  `,
    { cartId, lineIds }
  );
  return data.cartLinesRemove.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(
    `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFields }
    }
  `,
    { cartId }
  );
  return data.cart;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(amount: string, currencyCode: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}
