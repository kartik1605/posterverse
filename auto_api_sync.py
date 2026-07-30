#!/usr/bin/env python3
"""
auto_api_sync.py — Import catalog products directly into Shopify Admin API.
Reads SHOPIFY_ADMIN_TOKEN & SHOPIFY_STORE_DOMAIN from .env.local.
"""

import os
import sys
import json
import time
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ENV_FILE = ROOT / ".env.local"
JSON_FILE = ROOT / "stickitup_products.json"
API_VERSION = "2026-04"

def load_env():
    env = {}
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, val = line.split("=", 1)
                env[key.strip()] = val.strip().strip('"').strip("'")
    return env

def fetch_or_load_products():
    if JSON_FILE.exists():
        print(f"Loading local dataset from {JSON_FILE.name}...")
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            products = json.load(f)
            if products:
                print(f"Loaded {len(products)} products from local file.")
                return products

    print("Fetching product listings from https://www.stickitup.xyz/products.json?limit=250 ...")
    base_url = "https://www.stickitup.xyz/products.json"
    limit = 250
    page = 1
    all_products = []
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    while True:
        url = f"{base_url}?limit={limit}&page={page}"
        print(f"Fetching page {page}...")
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                products = data.get("products", [])
                if not products:
                    break
                all_products.extend(products)
                if len(products) < limit:
                    break
                page += 1
                time.sleep(0.5)
        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            break

    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(all_products, f, indent=2, ensure_ascii=False)
    print(f"Total products fetched: {len(all_products)}")
    return all_products

def sync_to_shopify():
    env = load_env()
    domain = env.get("SHOPIFY_STORE_DOMAIN") or "diqvkg-vm.myshopify.com"
    token = env.get("SHOPIFY_ADMIN_TOKEN")
    
    if not token:
        print("ERROR: SHOPIFY_ADMIN_TOKEN not found in .env.local")
        sys.exit(1)

    print("=" * 60)
    print(f"Shopify Admin API Sync")
    print(f"Store Domain : {domain}")
    print(f"API Version  : {API_VERSION}")
    print(f"Admin Token  : {token[:8]}...{token[-4:]}")
    print("=" * 60)

    products = fetch_or_load_products()
    admin_url = f"https://{domain}/admin/api/{API_VERSION}/products.json"
    
    headers = {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token
    }

    success_count = 0
    fail_count = 0

    print(f"\nStarting API import of {len(products)} products...\n")

    for idx, item in enumerate(products, 1):
        title = item.get("title", "Untitled Product")
        body_html = item.get("body_html", "")
        vendor = item.get("vendor", "StickItUp")
        ptype = item.get("product_type", "Sticker")

        tags_raw = item.get("tags", [])
        if isinstance(tags_raw, list):
            tags = ", ".join(tags_raw)
        else:
            tags = str(tags_raw)

        # Images
        images_payload = []
        raw_images = item.get("images", [])
        for img in raw_images:
            src = img.get("src") if isinstance(img, dict) else img
            if src:
                images_payload.append({"src": src})

        # Variants
        raw_variants = item.get("variants", [])
        variants_payload = []

        if raw_variants:
            for v in raw_variants:
                price = v.get("price") or "0.00"
                compare_price = v.get("compare_at_price")
                sku = v.get("sku") or f"{item.get('handle', 'prod')}-{idx}"
                v_payload = {
                    "price": str(price),
                    "sku": str(sku),
                    "inventory_management": "shopify",
                    "inventory_policy": "deny",
                    "inventory_quantity": 100
                }
                if compare_price:
                    v_payload["compare_at_price"] = str(compare_price)
                if v.get("title") and v.get("title") != "Default Title":
                    v_payload["option1"] = v.get("title")
                variants_payload.append(v_payload)
        else:
            variants_payload.append({
                "price": "149.00",
                "sku": f"{item.get('handle', 'prod')}-{idx}",
                "inventory_management": "shopify",
                "inventory_policy": "deny",
                "inventory_quantity": 100
            })

        payload = {
            "product": {
                "title": title,
                "body_html": body_html,
                "vendor": vendor,
                "product_type": ptype,
                "tags": tags,
                "status": "active",
                "variants": variants_payload,
                "images": images_payload
            }
        }

        req_data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(admin_url, data=req_data, headers=headers, method="POST")

        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                res_body = json.loads(resp.read().decode("utf-8"))
                created_p = res_body.get("product", {})
                success_count += 1
                print(f"[{idx}/{len(products)}] SUCCESS: '{title}' (ID: {created_p.get('id')})")
        except urllib.error.HTTPError as err:
            fail_count += 1
            err_msg = err.read().decode("utf-8") if err.fp else str(err)
            print(f"[{idx}/{len(products)}] ERROR HTTP {err.code} for '{title}': {err_msg[:150]}")
            if err.code == 429:
                print("  Rate limited (429)! Sleeping 3 seconds...")
                time.sleep(3)
        except Exception as err:
            fail_count += 1
            print(f"[{idx}/{len(products)}] FAILED for '{title}': {err}")

        # 0.5-second pause between requests to respect rate limits
        time.sleep(0.5)

    print("\n" + "=" * 60)
    print(f"Import Complete! Successfully created {success_count} products ({fail_count} failed).")
    print("=" * 60)

if __name__ == "__main__":
    sync_to_shopify()
