# Posterverse × Shopify — Connection Guide

The site works standalone right now (local cart, demo checkout). Follow these steps to make the **Checkout** button hand customers to your real Shopify checkout.

## 1. Create the products in Shopify

In your Shopify admin → **Products → Add product**, create one product per item in `js/data.js`. The important part is the **handle** (the URL slug Shopify assigns, editable under "Search engine listing"). It must match the `shopifyHandle` in `js/data.js`:

| Product on site | Required Shopify handle |
|---|---|
| Cosmic Holo Pack | `cosmic-holo-pack` |
| Retro Groove Sheet | `retro-groove-sheet` |
| Laptop Vibe Kit | `laptop-vibe-kit` |
| Smiley Pop Pack | `smiley-pop-pack` |
| Shape Study Duo | `shape-study-duo` |
| Abstract Flow | `abstract-flow` |
| Sunset Drive | `sunset-drive` |
| Bauhaus Beat | `bauhaus-beat` |
| Botanical Notes Set | `botanical-notes-set` |
| Birthday Blast Cards | `birthday-blast-cards` |
| Minimal Lines Set | `minimal-lines-set` |
| Artisan Jar Labels | `artisan-jar-labels` |
| Candle Co. Labels | `candle-co-labels` |
| Fresh Batch Labels | `fresh-batch-labels` |

Add the same variants (Finish / Size / Pack / Material) as Shopify **options** so variant names match what the site sends.

## 2. Get a Storefront API token

1. Shopify admin → **Settings → Apps and sales channels → Develop apps**.
2. **Create an app** (name it "Posterverse Website").
3. Under **Configuration → Storefront API**, enable the scopes:
   `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`.
4. **Install the app**, then copy the **Storefront API access token**. This is a public token scoped to read products and create carts, so it is safe to ship in frontend code — unlike an Admin API token (`shpat_…`), which must never appear in this repo.

## 3. Configure the site

Open `js/shopify.js` and fill in:

```js
const SHOPIFY_CONFIG = {
  domain: "your-store.myshopify.com",
  storefrontToken: "your-storefront-access-token"
};
```

That's it. The checkout button on `cart.html` will now:
1. Look up each cart item in Shopify by handle,
2. Create a Shopify cart via the Storefront API,
3. Redirect the customer to Shopify's hosted checkout (UPI/cards/COD handled by Shopify + your payment apps).

## 4. (Optional) Keep prices in sync

Prices shown on the site come from `js/data.js`; the price actually charged always comes from Shopify at checkout. When you change a price in Shopify, update `js/data.js` to match so customers aren't surprised.

## Notes

- The Storefront token is designed to be public (read-only product + cart scopes) — never put an **Admin API** token in this file.
- Test with Shopify's [Bogus Gateway](https://help.shopify.com/en/manual/checkout-settings/test-orders) before going live.
