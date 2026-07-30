/**
 * components/StickerCatalogGrid.js
 * Dark-themed sticker catalog grid component (#121212 background)
 * Vibrant category badges, bold typography, hover zoom, and instant cart checkout bindings.
 */

import { getProducts, createCart } from '../lib/shopify.js';

export class StickerCatalogGrid {
  constructor(containerId = 'sticker-catalog-grid') {
    this.container = document.getElementById(containerId);
    this.products = [];
    this.cart = [];
    this.activeCategory = 'all';
  }

  async init() {
    if (!this.container) return;
    this.renderLoading();
    try {
      this.products = await getProducts(250);
      this.render();
    } catch (err) {
      console.error('Failed to load products for catalog grid:', err);
      this.renderError('Unable to load sticker catalog from Shopify.');
    }
  }

  renderLoading() {
    this.container.innerHTML = `
      <div class="scg-loading" style="background:#121212; color:#FAF4EB; padding:5rem; text-align:center; font-family:'Space Grotesk',sans-serif;">
        <div class="scg-spinner" style="font-size:2rem; margin-bottom:1rem; animation: spin 1s infinite linear;">✦</div>
        <p style="font-size:1.1rem; color:#FFC229;">Loading sticker universe...</p>
      </div>
    `;
  }

  renderError(msg) {
    this.container.innerHTML = `
      <div class="scg-error" style="background:#121212; color:#FF5C1F; padding:4rem; text-align:center; font-family:'Space Grotesk',sans-serif;">
        <p>${msg}</p>
      </div>
    `;
  }

  render() {
    const categories = ['all', ...new Set(this.products.map(p => p.productType || 'Sticker'))];

    const filtered = this.activeCategory === 'all' 
      ? this.products 
      : this.products.filter(p => p.productType === this.activeCategory);

    this.container.innerHTML = `
      <style>
        .scg-wrapper {
          background-color: #121212;
          color: #FAF4EB;
          font-family: 'Space Grotesk', sans-serif;
          padding: 4rem 2rem;
          min-height: 100vh;
        }
        .scg-header {
          max-width: 1280px;
          margin: 0 auto 3rem;
          text-align: center;
        }
        .scg-title {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(2rem, 5vw, 3.8rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
          color: #FAF4EB;
        }
        .scg-title span {
          background: linear-gradient(135deg, #FF5C1F, #FFC229);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .scg-filter-bar {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }
        .scg-filter-chip {
          background: #1e1b24;
          border: 1px solid #332a40;
          color: #FAF4EB;
          padding: 0.5rem 1.25rem;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .scg-filter-chip:hover, .scg-filter-chip.active {
          background: #6C3BF4;
          color: #FFF;
          border-color: #6C3BF4;
          transform: translateY(-2px);
          box-shadow: 4px 4px 0 #17130E;
        }
        .scg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1280px;
          margin: 0 auto;
        }
        .scg-card {
          background: #18151f;
          border: 2px solid #282234;
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s, box-shadow 0.3s;
        }
        .scg-card:hover {
          transform: translateY(-6px);
          border-color: #6C3BF4;
          box-shadow: 6px 6px 0 #17130E;
        }
        .scg-card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #0d0b12;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .scg-card-img {
          width: 85%;
          height: 85%;
          object-fit: contain;
          transition: transform 0.4s ease;
        }
        .scg-card:hover .scg-card-img {
          transform: scale(1.08) rotate(-2deg);
        }
        .scg-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: #FF5C1F;
          color: #FFF;
          font-family: 'Unbounded', sans-serif;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.3rem 0.75rem;
          border-radius: 100px;
          box-shadow: 2px 2px 0 #17130E;
          z-index: 2;
        }
        .scg-badge.sticker { background: #FF5C1F; }
        .scg-badge.poster { background: #6C3BF4; }
        .scg-badge.card { background: #0FA3A3; }
        .scg-badge.label { background: #FFC229; color: #17130E; }

        .scg-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          justify-content: space-between;
        }
        .scg-card-title {
          font-family: 'Unbounded', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 0.5rem;
          color: #FAF4EB;
        }
        .scg-card-desc {
          font-size: 0.85rem;
          color: rgba(250, 244, 235, 0.6);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scg-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          gap: 1rem;
        }
        .scg-price {
          font-family: 'Unbounded', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #FFC229;
        }
        .scg-btn-cart {
          background: #FF5C1F;
          color: #FFF;
          border: 2px solid #17130E;
          padding: 0.65rem 1.2rem;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .scg-btn-cart:hover {
          background: #e04a10;
          transform: translateY(-2px);
          box-shadow: 3px 3px 0 #17130E;
        }
      </style>

      <div class="scg-wrapper">
        <div class="scg-header">
          <h2 class="scg-title">Sticker <span>Catalog</span></h2>
          <p style="color: rgba(250, 244, 235, 0.6); max-width: 540px; margin: 0 auto 1.5rem;">
            Waterproof vinyl stickers, art posters & custom brand labels. Designed loud, printed premium.
          </p>

          <div class="scg-filter-bar">
            ${categories.map(cat => `
              <button class="scg-filter-chip ${this.activeCategory === cat ? 'active' : ''}" data-cat="${cat}">
                ${cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="scg-grid">
          ${filtered.map(product => {
            const imgUrl = product.images?.edges[0]?.node?.url || 'https://via.placeholder.com/300?text=No+Image';
            const price = parseFloat(product.priceRange?.minVariantPrice?.amount || 0).toFixed(2);
            const currency = product.priceRange?.minVariantPrice?.currencyCode || 'INR';
            const firstVariantId = product.variants?.edges[0]?.node?.id;
            const pType = (product.productType || 'Sticker').toLowerCase();

            return `
              <div class="scg-card">
                <span class="scg-badge ${pType}">${product.productType || 'Sticker'}</span>
                <div class="scg-card-img-wrap">
                  <img class="scg-card-img" src="${imgUrl}" alt="${product.title}" loading="lazy" />
                </div>
                <div class="scg-card-body">
                  <div>
                    <h3 class="scg-card-title">${product.title}</h3>
                    <p class="scg-card-desc">${product.description || ''}</p>
                  </div>
                  <div class="scg-card-footer">
                    <span class="scg-price">₹${price}</span>
                    <button class="scg-btn-cart" data-variant-id="${firstVariantId}">
                      Add to Cart 🛒
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Filter chip clicks
    this.container.querySelectorAll('.scg-filter-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeCategory = e.currentTarget.dataset.cat;
        this.render();
      });
    });

    // Add to cart buttons
    this.container.querySelectorAll('.scg-btn-cart').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const variantId = e.currentTarget.dataset.variantId;
        if (!variantId) return;

        btn.disabled = true;
        btn.textContent = 'Creating Cart...';

        try {
          const cart = await createCart([{ variantId, quantity: 1 }]);
          if (cart && cart.checkoutUrl) {
            window.location.href = cart.checkoutUrl;
          } else {
            alert('Failed to initiate checkout.');
          }
        } catch (err) {
          console.error('Checkout error:', err);
          alert('Checkout Error: ' + err.message);
        } finally {
          btn.disabled = false;
          btn.textContent = 'Add to Cart 🛒';
        }
      });
    });
  }
}
