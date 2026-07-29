# Posterverse — Project Guidelines

- **Stack:** Shopify Liquid, CSS, JavaScript
- **Design System:** Sticker e-commerce platform (bold colors, dark accents, high-contrast grid layouts)
- **Base Theme:** Shopify Dawn
- **Target Audience:** Gen-Z / tech enthusiasts / pop-culture fans

## Layout

| Path | What it is |
|---|---|
| `index.html`, `shop.html`, `product.html`, `cart.html`, `about.html`, `contact.html` | Static prototype site (dark sticker-universe hero, vibe filtering, localStorage cart) |
| `css/style.css`, `js/` | Prototype styles + logic. `js/data.js` is the catalog, `js/shopify.js` is the Storefront-API checkout bridge |
| `custom-sticker-store/` | Shopify **Dawn** theme (cloned) — the production storefront target |
| `assets/img/stickers/` | Original die-cut sticker artwork (SVG). `*-t.svg` = transparent variant for floating hero |
| `_research/` | Competitor pricing research (CSV). Never push to the store |

## Design tokens (keep consistent between prototype and Dawn theme)

```
--cream #FAF4EB   --ink #17130E    --orange #FF5C1F
--violet #6C3BF4  --teal #0FA3A3   --yellow #FFC229   --pink #FF8FC7
Display font: Unbounded (700/800)   Body font: Space Grotesk
```

Dark surfaces use `#120E18`–`#221338` gradients with violet/orange radial glows.
Cards use a 3px ink border + hard offset shadow (`6px 6px 0 var(--ink)`), never soft-only shadows.

## Pricing model (market-calibrated, Jul 2026)

Indian sticker market sells **singles at ₹15–25 against an inflated MRP (~81% off)**. Match it:
single ₹19 / MRP ₹99 · premium-holo ₹29 / ₹149 · mystery 25-pack ₹299 / ₹999.
Free shipping above ₹499 — this is deliberate, it forces bundling like competitors do.

## Hard rules

- **Only original artwork.** Never reproduce competitor sticker designs, and never use
  third-party trademarked IP (game/film/brand logos, anime characters, car-brand marks).
  Competitor data in `_research/` is for pricing and category benchmarking only.
- `shopify theme dev` / `theme push` need interactive store auth — the user must run those.
