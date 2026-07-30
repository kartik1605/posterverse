import json
import urllib.request
import time
import sys

def fetch_all_products():
    base_url = "https://www.stickitup.xyz/products.json"
    limit = 250
    page = 1
    all_products = []

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    while True:
        url = f"{base_url}?limit={limit}&page={page}"
        print(f"Fetching page {page}: {url} ...")
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                products = data.get("products", [])
                if not products:
                    print(f"No products found on page {page}. Scraping finished.")
                    break
                print(f"  Received {len(products)} products on page {page}.")
                all_products.extend(products)
                if len(products) < limit:
                    print("  Reached last page.")
                    break
                page += 1
                time.sleep(1)
        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            break

    print(f"Total products fetched: {len(all_products)}")
    output_filename = "stickitup_products.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(all_products, f, indent=2, ensure_ascii=False)
    print(f"Saved raw extracted dataset to {output_filename}")

if __name__ == "__main__":
    fetch_all_products()
