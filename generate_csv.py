import json
import csv
import sys

def create_shopify_csv():
    json_filename = "stickitup_products.json"
    csv_filename = "clean_shopify_import.csv"

    print(f"Reading {json_filename}...")
    with open(json_filename, "r", encoding="utf-8") as f:
        products = json.load(f)

    headers = [
        "Handle",
        "Title",
        "Body (HTML)",
        "Vendor",
        "Type",
        "Tags",
        "Published",
        "Option1 Name",
        "Option1 Value",
        "Variant SKU",
        "Variant Inventory Qty",
        "Variant Inventory Policy",
        "Variant Fulfillment Service",
        "Variant Price",
        "Variant Compare At Price",
        "Variant Requires Shipping",
        "Variant Taxable",
        "Image Src",
        "Image Position"
    ]

    rows = []
    for product in products:
        handle = product.get("handle", "")
        title = product.get("title", "")
        body_html = product.get("body_html", "")
        vendor = product.get("vendor", "StickItUp")
        ptype = product.get("product_type", "Sticker")

        tags_raw = product.get("tags", [])
        if isinstance(tags_raw, list):
            tags = ", ".join(tags_raw)
        else:
            tags = str(tags_raw)

        # Get first image URL
        images = product.get("images", [])
        image_src = ""
        if images and isinstance(images, list):
            image_src = images[0].get("src", "")
        elif product.get("image"):
            image_src = product.get("image", {}).get("src", "")

        variants = product.get("variants", [])
        first_variant = variants[0] if variants else {}

        sku = first_variant.get("sku") or f"{handle}-001"
        price = first_variant.get("price") or "0.00"
        compare_price = first_variant.get("compare_at_price") or ""

        row = {
            "Handle": handle,
            "Title": title,
            "Body (HTML)": body_html,
            "Vendor": vendor,
            "Type": ptype,
            "Tags": tags,
            "Published": "TRUE",
            "Option1 Name": "Title",
            "Option1 Value": "Default Title",
            "Variant SKU": sku,
            "Variant Inventory Qty": 100,
            "Variant Inventory Policy": "deny",
            "Variant Fulfillment Service": "manual",
            "Variant Price": price,
            "Variant Compare At Price": compare_price if compare_price else "",
            "Variant Requires Shipping": "TRUE",
            "Variant Taxable": "TRUE",
            "Image Src": image_src,
            "Image Position": 1
        }
        rows.append(row)

    print(f"Writing {len(rows)} product rows to {csv_filename}...")
    with open(csv_filename, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Successfully generated {csv_filename} with {len(rows)} products.")

if __name__ == "__main__":
    create_shopify_csv()
