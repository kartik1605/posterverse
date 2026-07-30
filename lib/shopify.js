/**
 * lib/shopify.js — Shopify Storefront API GraphQL Client
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN || "diqvkg-vm.myshopify.com";
const storefrontToken = process.env.SHOPIFY_STOREFRONT_TOKEN || "";
const API_VERSION = "2024-10";

const endpoint = `https://${domain}/api/${API_VERSION}/graphql.json`;

async function shopifyFetch({ query, variables = {} }) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();
    if (json.errors) {
      console.error("Shopify GraphQL Errors:", json.errors);
      throw new Error(json.errors[0]?.message || "Shopify API Error");
    }
    return json.data;
  } catch (error) {
    console.error("Failed to fetch from Shopify Storefront API:", error);
    throw error;
  }
}

/**
 * Fetch list of products
 */
export async function getProducts(first = 250) {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            productType
            vendor
            tags
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({ query, variables: { first } });
  return data?.products?.edges?.map(edge => edge.node) || [];
}

/**
 * Fetch a single product by handle
 */
export async function getProductByHandle(handle) {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        productType
        vendor
        tags
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              sku
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
              }
              availableForSale
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({ query, variables: { handle } });
  return data?.product || null;
}

/**
 * Create a checkout cart with line items and return the checkoutUrl
 */
export async function createCart(lineItems) {
  const query = `
    mutation createCart($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const lines = lineItems.map(item => ({
    merchandiseId: item.variantId,
    quantity: item.quantity || 1,
  }));

  const data = await shopifyFetch({ query, variables: { lines } });
  const userErrors = data?.cartCreate?.userErrors;
  if (userErrors && userErrors.length > 0) {
    throw new Error(userErrors[0].message);
  }

  return data?.cartCreate?.cart || null;
}
