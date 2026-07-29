#!/usr/bin/env python3
"""
sync_catalog.py — pull the live Posterverse catalogue out of Shopify and write
it where the frontend can render it.

    python scripts/sync_catalog.py

Outputs
    live_catalog.json    structured catalogue for frontend rendering
    (optionally) js/data.live.js  with --emit-js, a drop-in for js/data.js

Reads through the Storefront API using the public token already configured in
js/shopify.js, paginating with cursors until the store is exhausted.

This syncs YOUR OWN store. Point it at someone else's storefront and you are
copying their catalogue — their product photography and descriptions are their
copyright, and much of the artwork in this category is third-party trademarked
IP that cannot be resold. Keep it aimed here.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
SHOPIFY_JS = ROOT / "js" / "shopify.js"
API_VERSION = "2024-10"
PAGE_SIZE = 50

# Vibe keys used by the theme's filter chips, matched against product tags.
VIBE_KEYS = [
    "humor", "hustle", "desi", "cars", "gaming", "tech", "music",
    "love", "space", "food", "warning", "animals", "abstract", "mystery",
]

CATEGORY_BY_TYPE = {
    "sticker": "stickers",
    "poster": "posters",
    "greeting card": "cards",
    "brand label": "labels",
}

QUERY = """
query Catalog($cursor: String, $n: Int!) {
  products(first: $n, after: $cursor) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id
      title
      handle
      descriptionHtml
      description
      productType
      vendor
      tags
      availableForSale
      featuredImage { url altText }
      images(first: 10) { nodes { url altText } }
      priceRange { minVariantPrice { amount currencyCode } }
      compareAtPriceRange { minVariantPrice { amount } }
      options { name values }
      variants(first: 50) {
        nodes {
          id
          title
          sku
          availableForSale
          price { amount currencyCode }
          compareAtPrice { amount }
          selectedOptions { name value }
        }
      }
    }
  }
}
"""


def read_credentials() -> tuple[str, str]:
    """Pull domain + Storefront token out of js/shopify.js so there is one source."""
    if not SHOPIFY_JS.exists():
        sys.exit(f"missing {SHOPIFY_JS}")
    text = SHOPIFY_JS.read_text(encoding="utf-8")
    domain = re.search(r'domain:\s*"([^"]*)"', text)
    token = re.search(r'storefrontToken:\s*"([^"]*)"', text)
    if not (domain and token and domain.group(1) and token.group(1)):
        sys.exit("SHOPIFY_CONFIG in js/shopify.js is not filled in")
    return domain.group(1), token.group(1)


def storefront(domain: str, token: str, query: str, variables: dict) -> dict:
    payload = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    req = urllib.request.Request(
        f"https://{domain}/api/{API_VERSION}/graphql.json",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        sys.exit(f"Storefront API returned HTTP {exc.code}: {exc.read()[:300]!r}")
    except urllib.error.URLError as exc:
        sys.exit(f"could not reach {domain}: {exc.reason}")

    if body.get("errors"):
        sys.exit("Storefront API errors: " + json.dumps(body["errors"], indent=2))
    return body["data"]


def money(value: str | None) -> float | None:
    if value in (None, ""):
        return None
    try:
        return round(float(value))
    except (TypeError, ValueError):
        return None


def classify(node: dict) -> tuple[str, str | None]:
    """Map Shopify product type + tags onto the site's category and vibe."""
    ptype = (node.get("productType") or "").strip().lower()
    category = CATEGORY_BY_TYPE.get(ptype)
    if not category:
        # Fall back to a tag that names a category directly.
        lowered = {t.lower() for t in node.get("tags", [])}
        category = next((c for c in ("stickers", "posters", "cards", "labels") if c in lowered), "stickers")

    vibe = None
    for tag in node.get("tags", []):
        if tag.lower() in VIBE_KEYS:
            vibe = tag.lower()
            break
    return category, vibe


def fetch_all(domain: str, token: str) -> list[dict[str, Any]]:
    products: list[dict[str, Any]] = []
    cursor = None
    page = 0

    while True:
        page += 1
        data = storefront(domain, token, QUERY, {"cursor": cursor, "n": PAGE_SIZE})
        block = data["products"]
        nodes = block["nodes"]
        products.extend(nodes)
        print(f"  page {page}: {len(nodes)} products")
        if not block["pageInfo"]["hasNextPage"]:
            break
        cursor = block["pageInfo"]["endCursor"]

    return products


def transform(nodes: list[dict]) -> list[dict]:
    """Reshape into the structure the frontend already understands."""
    out = []
    for n in nodes:
        category, vibe = classify(n)
        price = money(n["priceRange"]["minVariantPrice"]["amount"])
        compare = money((n.get("compareAtPriceRange") or {}).get("minVariantPrice", {}).get("amount"))

        options = {o["name"]: o["values"] for o in n.get("options", [])
                   if o["name"].lower() != "title"}

        images = [i["url"] for i in n.get("images", {}).get("nodes", [])]
        featured = (n.get("featuredImage") or {}).get("url")
        if featured and featured not in images:
            images.insert(0, featured)

        out.append({
            "id": n["handle"],
            "shopifyId": n["id"],
            "name": n["title"],
            "handle": n["handle"],
            "category": category,
            "vibe": vibe,
            "vendor": n.get("vendor"),
            "type": n.get("productType"),
            "tags": n.get("tags", []),
            "price": price,
            "mrp": compare if compare and compare > (price or 0) else None,
            "currency": n["priceRange"]["minVariantPrice"]["currencyCode"],
            "available": n.get("availableForSale", False),
            "desc": n.get("description", "").strip(),
            "descHtml": n.get("descriptionHtml", ""),
            "img": images[0] if images else None,
            "images": images,
            "options": options,
            "variants": [
                {
                    "id": v["id"],
                    "title": v["title"],
                    "sku": v.get("sku"),
                    "price": money(v["price"]["amount"]),
                    "mrp": money((v.get("compareAtPrice") or {}).get("amount")),
                    "available": v.get("availableForSale", False),
                    "selected": {o["name"]: o["value"] for o in v.get("selectedOptions", [])},
                }
                for v in n.get("variants", {}).get("nodes", [])
            ],
        })
    return out


def emit_js(products: list[dict], path: Path) -> None:
    banner = (
        "/* Generated by scripts/sync_catalog.py — do not edit by hand.\n"
        "   Live Shopify catalogue; swap js/data.js for this to render store data. */\n"
    )
    body = "const PRODUCTS = " + json.dumps(products, indent=2, ensure_ascii=False) + ";\n"
    path.write_text(banner + body, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync the live Shopify catalogue.")
    parser.add_argument("--emit-js", action="store_true",
                        help="also write js/data.live.js as a drop-in for js/data.js")
    args = parser.parse_args()

    domain, token = read_credentials()
    print(f"Syncing {domain} (Storefront API {API_VERSION})")

    nodes = fetch_all(domain, token)
    products = transform(nodes)

    out = ROOT / "live_catalog.json"
    out.write_text(json.dumps(products, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\nWrote {out.relative_to(ROOT)}")
    print(f"  products : {len(products)}")
    print(f"  variants : {sum(len(p['variants']) for p in products)}")

    if products:
        with_img = sum(1 for p in products if p["img"])
        print(f"  images   : {with_img}/{len(products)} products have one")
        vibes = sorted({p["vibe"] for p in products if p["vibe"]})
        print(f"  vibes    : {', '.join(vibes) if vibes else 'none — tag products to drive the filter chips'}")
        missing = [k for k in VIBE_KEYS if k not in vibes]
        if missing:
            print(f"  chips with no products: {', '.join(missing)}")
    else:
        print("\n  The store returned no products.")
        print("  Import your catalogue first:")
        print("    node scripts/build-shopify-import.js")
        print("    then Shopify admin -> Products -> Import -> shopify_import.csv")

    if args.emit_js:
        js = ROOT / "js" / "data.live.js"
        emit_js(products, js)
        print(f"  wrote {js.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
