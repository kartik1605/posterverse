/* ============================================
   POSTERVERSE — Shared site JS
   Nav, cart (localStorage), reveal animations,
   product card rendering, toast notifications.
   ============================================ */

/* Marks that JS is alive, which arms the reveal animations' hidden
   start state. Without it the CSS leaves all content visible. */
document.documentElement.classList.add("js");

/* ---------- CART (localStorage) ---------- */
const Cart = {
  KEY: "posterverse_cart",
  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    updateCartBadge(true);
  },
  add(productId, qty = 1, variant = "") {
    const items = this.get();
    const found = items.find(i => i.id === productId && i.variant === variant);
    if (found) found.qty += qty;
    else items.push({ id: productId, qty, variant });
    this.save(items);
  },
  remove(productId, variant = "") {
    this.save(this.get().filter(i => !(i.id === productId && i.variant === variant)));
  },
  setQty(productId, variant, qty) {
    const items = this.get();
    const found = items.find(i => i.id === productId && i.variant === variant);
    if (found) {
      found.qty = Math.max(1, qty);
      this.save(items);
    }
  },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() {
    return this.get().reduce((s, i) => {
      const p = PRODUCTS.find(pr => pr.id === i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  },
  clear() { this.save([]); }
};

function updateCartBadge(bump = false) {
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = Cart.count();
    if (bump) {
      el.classList.remove("bump");
      void el.offsetWidth;
      el.classList.add("bump");
    }
  });
}

/* ---------- TOAST ---------- */
let toastTimer;
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = '<span class="t-dot"></span><span class="t-msg"></span>';
    document.body.appendChild(t);
  }
  t.querySelector(".t-msg").textContent = msg;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- PRODUCT CARD RENDER ---------- */
function productCardHTML(p) {
  const off = p.mrp ? Math.round((1 - p.price / p.mrp) * 100) : 0;
  const badge = p.badge
    ? `<span class="product-badge ${p.badge}">${p.badge === "hot" ? "Bestseller" : p.badge === "new" ? "New drop" : "Sale"}</span>`
    : "";
  const save = p.mrp ? `<span class="save-pill">Save ${formatINR(p.mrp - p.price)}</span>` : "";
  return `
  <article class="product-card">
    <a class="product-thumb" href="product.html?id=${p.id}">
      ${badge}
      ${save}
      <img src="${p.img}" alt="${p.name}" loading="lazy">
    </a>
    <button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button>
    <div class="product-info">
      <span class="product-cat">${CATEGORY_META[p.category].label}</span>
      <a href="product.html?id=${p.id}"><h3 class="product-name">${p.name}</h3></a>
      <div class="product-price">
        <b>${formatINR(p.price)}</b>
        ${p.mrp ? `<s>${formatINR(p.mrp)}</s><span class="off">${off}% off</span>` : ""}
      </div>
    </div>
  </article>`;
}

/* quick-add delegation (works on any page with product cards) */
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  const p = PRODUCTS.find(pr => pr.id === btn.dataset.add);
  if (!p) return;
  const firstOption = p.options ? Object.values(p.options)[0][0] : "";
  Cart.add(p.id, 1, firstOption);
  toast(`${p.name} added to cart ✦`);
});

/* ---------- NAV / HEADER ---------- */
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();

  const header = document.querySelector(".site-header");
  if (header) {
    addEventListener("scroll", () => {
      header.classList.toggle("scrolled", scrollY > 10);
    }, { passive: true });
  }

  const burger = document.querySelector(".hamburger");
  if (burger) {
    burger.addEventListener("click", () => document.body.classList.toggle("menu-open"));
    document.querySelectorAll(".nav-links a").forEach(a =>
      a.addEventListener("click", () => document.body.classList.remove("menu-open"))
    );
  }

  /* active nav link */
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-scale, [data-stagger]");
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });

  revealEls.forEach(el => io.observe(el));

  /* Failsafe: if the observer never reports (background tab, older engine),
     show everything rather than leaving the page blank. */
  setTimeout(() => revealEls.forEach(el => el.classList.add("in")), 2500);

  /* stagger children delays */
  document.querySelectorAll("[data-stagger]").forEach(wrap => {
    [...wrap.children].forEach((child, i) => {
      child.style.transitionDelay = `${i * 90}ms`;
    });
  });

  /* ---------- COUNTER ANIMATION ---------- */
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const dur = 1400;
      const t0 = performance.now();
      (function tick(now) {
        const k = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(el => counterIO.observe(el));

  /* ---------- NEWSLETTER ---------- */
  document.querySelectorAll(".newsletter-form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const email = form.querySelector("input[type=email]").value.trim();
      if (!email) return;
      form.reset();
      toast("You're on the list! Welcome to the verse ✦");
    });
  });

  /* ---------- HERO PARALLAX (mouse-follow sticker field) ---------- */
  const heroDark = document.querySelector(".hero-dark");
  if (heroDark && matchMedia("(pointer: fine)").matches) {
    const layers = heroDark.querySelectorAll("[data-depth]");
    let raf = null;
    heroDark.addEventListener("mousemove", e => {
      const r = heroDark.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        layers.forEach(el => {
          const d = parseFloat(el.dataset.depth) || 1;
          el.style.setProperty("--px", `${(-nx * 34 * d).toFixed(1)}px`);
          el.style.setProperty("--py", `${(-ny * 26 * d).toFixed(1)}px`);
        });
        raf = null;
      });
    });
    heroDark.addEventListener("mouseleave", () => {
      layers.forEach(el => { el.style.setProperty("--px", "0px"); el.style.setProperty("--py", "0px"); });
    });
  }

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : 0;
    });
  });
});
