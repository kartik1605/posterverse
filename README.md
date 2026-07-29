# Posterverse ✦

Sticker e-commerce storefront — vinyl stickers, art posters, creative cards and custom brand labels, built for the Indian market.

**Stack:** Shopify Liquid (Dawn) · CSS · JavaScript
**Audience:** Gen-Z, tech enthusiasts, pop-culture fans

---

## What's in here

| Path | What it is |
|---|---|
| `index.html` `shop.html` `product.html` `cart.html` `about.html` `contact.html` | Static prototype storefront — dark "sticker universe" hero with mouse parallax, Shop-by-Vibe filtering, localStorage cart |
| `css/style.css` | Full design system (tokens, animations, responsive) |
| `js/data.js` | Product catalog — 33 products with vibe tags |
| `js/main.js` | Cart, scroll reveals, hero parallax, counters, toasts |
| `js/shopify.js` | Storefront API checkout bridge (see [README-SHOPIFY.md](README-SHOPIFY.md)) |
| `assets/img/stickers/` | Original die-cut sticker artwork (SVG). `*-t.svg` = transparent, for the floating hero |
| `custom-sticker-store/` | Shopify **Dawn** theme — the production storefront target |

Conventions and design tokens: [CLAUDE.md](CLAUDE.md).

## Running the prototype

Any static server works:

```bash
python -m http.server 4324
```

Then open <http://localhost:4324>.

## Running the Shopify theme

Requires the Shopify CLI and an interactive login to your store:

```bash
cd custom-sticker-store && shopify theme dev --store your-store.myshopify.com
```

## Design rules

- **Original artwork only.** No competitor designs, and no third-party trademarked IP
  (game, film, or brand marks). Every sticker in `assets/img/stickers/` is drawn for this project.
- Cards use a 3px ink border with a hard offset shadow — never soft-only shadows.
- Dark surfaces are `#120E18`–`#221338` gradients with violet/orange radial glows.

## Pricing model

The Indian sticker market sells singles at ₹15–25 against an inflated MRP (~80% off).
Posterverse matches it: single ₹19 / MRP ₹99 · premium holographic ₹29 / ₹149 ·
mystery 25-pack ₹299 / ₹999. Free shipping above ₹499 is deliberate — it drives bundling.

---

Made with ✦ in India.
