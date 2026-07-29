/* ============================================
   POSTERVERSE — Shopify bridge
   ------------------------------------------------
   The site works standalone with a local cart.
   To connect your Shopify store:

   1. In Shopify admin → Settings → Apps → Develop apps,
      create an app with Storefront API access and copy
      the Storefront access token.
   2. Fill in SHOPIFY_CONFIG below.
   3. In js/data.js, make sure every product's
      `shopifyHandle` matches the product handle in
      your Shopify store.
   Full steps in README-SHOPIFY.md.
   ============================================ */

/* The Storefront access token is a public, read-only credential — it ships to
   the browser by design and is scoped to reading products and creating carts.
   It is NOT an Admin API token (`shpat_…`), which must never appear here.
   Rotate it in Shopify admin → Apps → your app → Storefront API if needed. */
const SHOPIFY_CONFIG = {
  domain: "diqvkg-vm.myshopify.com",
  storefrontToken: "23a93f7c02846b888468b15a4784e82d"
};

const shopifyEnabled = () => SHOPIFY_CONFIG.domain && SHOPIFY_CONFIG.storefrontToken;

/**
 * Checkout: with Shopify configured, creates a cart via the
 * Storefront API and redirects to Shopify's hosted checkout.
 * Without it, shows a friendly notice (local demo mode).
 */
async function shopifyCheckout() {
  const items = Cart.get();
  if (!items.length) return;

  if (!shopifyEnabled()) {
    toast("Demo mode — connect your Shopify store to enable checkout (see README-SHOPIFY.md)");
    return;
  }

  try {
    // Resolve each local product to its Shopify variant id
    const lines = [];
    for (const item of items) {
      const p = PRODUCTS.find(pr => pr.id === item.id);
      if (!p || !p.shopifyHandle) continue;
      const query = `
        query ProductByHandle($handle: String!) {
          product(handle: $handle) {
            variants(first: 20) { nodes { id title } }
          }
        }`;
      const data = await shopifyQuery(query, { handle: p.shopifyHandle });
      const variants = data?.product?.variants?.nodes || [];
      const match = variants.find(v => v.title.toLowerCase().includes((item.variant || "").split(" / ")[0]?.toLowerCase() || "")) || variants[0];
      if (match) lines.push({ merchandiseId: match.id, quantity: item.qty });
    }

    if (!lines.length) {
      toast("Products not found in Shopify — check shopifyHandle values in js/data.js");
      return;
    }

    const cartMutation = `
      mutation CartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart { checkoutUrl }
          userErrors { message }
        }
      }`;
    const result = await shopifyQuery(cartMutation, { lines });
    const url = result?.cartCreate?.cart?.checkoutUrl;
    if (url) {
      location.href = url; // hand off to Shopify's secure checkout
    } else {
      toast("Could not create Shopify checkout — see console");
      console.error(result?.cartCreate?.userErrors);
    }
  } catch (err) {
    console.error(err);
    toast("Checkout error — see console");
  }
}

async function shopifyQuery(query, variables) {
  const res = await fetch(`https://${SHOPIFY_CONFIG.domain}/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_CONFIG.storefrontToken
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  return json.data;
}
