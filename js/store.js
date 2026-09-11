/* Shared storefront logic: header, cart/wishlist (localStorage), rendering. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const money = (n) => "$" + n.toFixed(2);
  const params = new URLSearchParams(location.search);
  const S = window.STORE;
  const byId = (id) => S.products.find((p) => p.id === id);

  /* ---------- state ---------- */
  const KEY_CART = "anoshvi_cart";
  const KEY_WISH = "anoshvi_wish";
  const load = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } };
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  let cart = load(KEY_CART);   // { id: qty }
  let wish = load(KEY_WISH);   // { id: true }

  const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const cartSubtotal = () => Object.entries(cart).reduce((s, [id, q]) => { const p = byId(id); return s + (p ? p.price * q : 0); }, 0);

  async function addToCart(id, qty = 1) {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: qty }),
      });

      if (!response.ok) throw new Error("Cart API request failed");

      cart[id] = (cart[id] || 0) + qty;
      save(KEY_CART, cart);
      updateCartBadge();
      toast(qty + " added to cart");
      return true;
    } catch (error) {
      console.error(error);
      toast("Unable to add item to cart");
      return false;
    }
  }
  function setQty(id, qty) {
    if (qty <= 0) delete cart[id]; else cart[id] = qty;
    save(KEY_CART, cart); updateCartBadge();
  }
  function removeItem(id) { delete cart[id]; save(KEY_CART, cart); updateCartBadge(); }
  function toggleWish(id) {
    if (wish[id]) delete wish[id]; else wish[id] = true;
    save(KEY_WISH, wish);
    return !!wish[id];
  }

  /* ---------- placeholder image ---------- */
  function imgFor(p, h) {
    const initials = p.brand ? p.brand.slice(0, 2).toUpperCase() : "AZ";
    const label = p.title.length > 28 ? p.title.slice(0, 26) + "…" : p.title;
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>` +
      `<rect width='400' height='400' fill='#ffffff'/>` +
      `<rect x='20' y='20' width='360' height='360' rx='16' fill='${p.color}'/>` +
      `<circle cx='200' cy='150' r='70' fill='rgba(255,255,255,.18)'/>` +
      `<text x='200' y='170' font-family='Arial' font-size='64' font-weight='700' fill='#fff' text-anchor='middle'>${initials}</text>` +
      `<text x='200' y='300' font-family='Arial' font-size='24' fill='#fff' text-anchor='middle' opacity='.95'>${escapeXml(label)}</text>` +
      `</svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }
  const escapeXml = (s) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));

  function stars(rating, reviews) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    let s = "★".repeat(full) + (half ? "½" : "");
    s = s.padEnd(5, "☆").slice(0, half ? full + 1 : 5);
    let out = "★★★★★".slice(0, full);
    if (half) out += "½";
    const empty = 5 - full - (half ? 1 : 0);
    out += "☆".repeat(Math.max(0, empty));
    return `<span class="stars">${out}<span class="count">${reviews.toLocaleString()}</span></span>`;
  }

  /* ---------- header / footer ---------- */
  function renderChrome() {
    const optionTags = S.categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
    const header = `
      <div class="top">
        <div class="top-row">
          <a class="logo" href="index.html">anoshvi<span class="tld">.uk</span></a>
          <div class="deliver hide-sm"><span>📍</span><div><small>Deliver to</small><br><b>United Kingdom</b></div></div>
          <form class="search" onsubmit="return Store.doSearch(event)">
            <select id="search-cat"><option value="">All</option>${optionTags}</select>
            <input id="search-input" type="text" placeholder="Search anoshvi.uk" />
            <button type="submit" aria-label="Search">🔎</button>
          </form>
          <a class="navlink hide-sm" href="#"><small>Hello, sign in</small><b>Account &amp; Lists</b></a>
          <a class="navlink hide-sm" href="#"><small>Returns</small><b>&amp; Orders</b></a>
          <a class="navlink" href="wishlist.html"><small>Your</small><b>Wishlist ♥</b></a>
          <a class="navlink cart-link" href="cart.html"><span class="cart-count" id="cart-badge">0</span><b>Cart</b></a>
        </div>
        <div class="subnav">
          <a class="all" href="index.html">☰ All</a>
          ${S.categories.map((c) => `<a href="category.html?cat=${c.id}">${c.name}</a>`).join("")}
          <a href="index.html#deals">Today's Deals</a>
        </div>
      </div>`;
    const footer = `
      <footer>
        <div class="back-top" onclick="window.scrollTo({top:0,behavior:'smooth'})">Back to top</div>
        <div class="foot-cols">
          <div><h5>Get to Know Us</h5><a href="#">About</a><a href="#">Careers</a><a href="#">Press</a></div>
          <div><h5>Shop With Us</h5><a href="index.html">All Products</a><a href="cart.html">Your Cart</a><a href="wishlist.html">Wishlist</a></div>
          <div><h5>Let Us Help You</h5><a href="#">Your Account</a><a href="#">Shipping</a><a href="#">Returns</a></div>
          <div><h5>Categories</h5>${S.categories.slice(0,4).map((c)=>`<a href="category.html?cat=${c.id}">${c.name}</a>`).join("")}</div>
        </div>
        <div class="foot-bottom">© ${new Date().getFullYear()} anoshvi.uk — a demo storefront. Not a real store; no orders are processed.</div>
      </footer>`;
    const h = $("#site-header"); if (h) h.innerHTML = header;
    const f = $("#site-footer"); if (f) f.innerHTML = footer;
    const q = params.get("q"); if (q && $("#search-input")) $("#search-input").value = q;
    updateCartBadge();
  }
  function updateCartBadge() { const b = $("#cart-badge"); if (b) b.textContent = cartCount(); }
  function doSearch(e) {
    e.preventDefault();
    const q = $("#search-input").value.trim();
    const cat = $("#search-cat").value;
    location.href = "category.html?" + new URLSearchParams({ ...(cat ? { cat } : {}), ...(q ? { q } : {}) }).toString();
    return false;
  }

  /* ---------- product card ---------- */
  function card(p) {
    const active = wish[p.id] ? "active" : "";
    return `
      <div class="p-card">
        <button class="wish ${active}" data-wish="${p.id}" title="Add to wishlist">♥</button>
        <a href="product.html?id=${p.id}"><img class="img" src="${imgFor(p)}" alt="${escapeXml(p.title)}"></a>
        <a href="product.html?id=${p.id}"><p class="title">${p.title}</p></a>
        ${stars(p.rating, p.reviews)}
        <div class="price"><span class="cur">${money(p.price)}</span><span class="old">${money(p.oldPrice)}</span></div>
        ${p.prime ? '<span class="badge-prime">✓ prime FREE delivery</span>' : ""}
        <button class="btn block" data-add="${p.id}">Add to cart</button>
      </div>`;
  }
  function wireCards(root = document) {
    $$("[data-add]", root).forEach((b) => b.addEventListener("click", () => { void addToCart(b.dataset.add); }));
    $$("[data-wish]", root).forEach((b) => b.addEventListener("click", () => {
      const on = toggleWish(b.dataset.wish); b.classList.toggle("active", on);
      toast(on ? "Added to wishlist" : "Removed from wishlist");
    }));
  }

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1600);
  }

  /* ================= PAGE RENDERERS ================= */
  function renderHome() {
    const catCards = S.categories.map((c) => {
      const sample = S.products.find((p) => p.category === c.id);
      return `<div class="card"><h3>${c.name}</h3>
        <a href="category.html?cat=${c.id}"><img class="thumb" src="${imgFor(sample)}" alt="${c.name}"></a>
        <a href="category.html?cat=${c.id}">Shop ${c.name}</a></div>`;
    }).join("");
    $("#cat-cards").innerHTML = catCards;

    const deals = S.products.slice().sort((a, b) => (b.oldPrice - b.price) - (a.oldPrice - a.price)).slice(0, 8);
    $("#deals-grid").innerHTML = deals.map(card).join("");

    const top = S.products.slice().sort((a, b) => b.rating - a.rating).slice(0, 10);
    $("#top-grid").innerHTML = top.map(card).join("");
    wireCards();
  }

  function renderCategory() {
    const cat = params.get("cat");
    const q = (params.get("q") || "").toLowerCase();
    const catObj = S.categories.find((c) => c.id === cat);
    $("#cat-title").textContent = q ? `Results for "${params.get("q")}"` : (catObj ? catObj.name : "All Products");
    $("#crumb").textContent = catObj ? catObj.name : "All";

    // brand filter options
    let base = S.products.filter((p) => (!cat || p.category === cat) && (!q || (p.title + " " + p.brand + " " + p.desc).toLowerCase().includes(q)));
    const brands = Array.from(new Set(base.map((p) => p.brand))).sort();
    $("#brand-filters").innerHTML = brands.map((b) => `<label><input type="checkbox" value="${b}" class="fbrand"> ${b}</label>`).join("") || "<small>—</small>";

    const state = { minRating: 0, maxPrice: 1000, brands: new Set(), sort: "featured" };

    function apply() {
      let list = base.filter((p) => p.rating >= state.minRating && p.price <= state.maxPrice &&
        (state.brands.size === 0 || state.brands.has(p.brand)));
      const sorters = {
        featured: (a, b) => b.reviews - a.reviews,
        low: (a, b) => a.price - b.price,
        high: (a, b) => b.price - a.price,
        rating: (a, b) => b.rating - a.rating,
      };
      list.sort(sorters[state.sort]);
      $("#result-count").textContent = list.length + " result" + (list.length === 1 ? "" : "s");
      $("#cat-grid").innerHTML = list.length ? list.map(card).join("") : "<p style='padding:20px'>No products match your filters.</p>";
      wireCards();
    }

    $("#price-range").addEventListener("input", (e) => { state.maxPrice = +e.target.value; $("#price-val").textContent = money(+e.target.value); apply(); });
    $$(".frating").forEach((r) => r.addEventListener("change", (e) => { state.minRating = +e.target.value; apply(); }));
    $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; apply(); });
    document.addEventListener("change", (e) => {
      if (e.target.classList && e.target.classList.contains("fbrand")) {
        if (e.target.checked) state.brands.add(e.target.value); else state.brands.delete(e.target.value);
        apply();
      }
    });
    apply();
  }

  function renderProduct() {
    const p = byId(params.get("id"));
    const root = $("#product-root");
    if (!p) { root.innerHTML = "<div class='empty'><h2>Product not found</h2><a href='index.html'>Continue shopping</a></div>"; return; }
    const catObj = S.categories.find((c) => c.id === p.category);
    const related = S.products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 5);
    const qtyOpts = Array.from({ length: 10 }, (_, i) => `<option>${i + 1}</option>`).join("");
    root.innerHTML = `
      <div class="breadcrumb"><a href="index.html">Home</a> › <a href="category.html?cat=${p.category}">${catObj ? catObj.name : ""}</a> › ${p.title}</div>
      <div class="detail">
        <div><img class="big-img" src="${imgFor(p)}" alt="${p.title}"></div>
        <div>
          <h1>${p.title}</h1>
          <div>${stars(p.rating, p.reviews)}</div>
          <hr>
          <div class="price"><span class="cur">${money(p.price)}</span> <span class="old">${money(p.oldPrice)}</span></div>
          <p class="note">You save ${money(p.oldPrice - p.price)} (${Math.round((1 - p.price / p.oldPrice) * 100)}%)</p>
          <p class="desc">${p.desc}</p>
          <p class="note">Brand: <b>${p.brand}</b> · Category: ${catObj ? catObj.name : ""}</p>
        </div>
        <div class="buybox">
          <div class="price"><span class="cur">${money(p.price)}</span></div>
          ${p.prime ? '<span class="badge-prime">✓ prime FREE delivery</span>' : ""}
          <p class="instock">In Stock</p>
          <div class="qty"><label for="qty">Qty:</label><select id="qty">${qtyOpts}</select></div>
          <button class="btn block big" id="add-btn">Add to Cart</button>
          <button class="btn block secondary" id="buy-btn">Buy Now</button>
        </div>
      </div>
      <h2 class="section-title">More in ${catObj ? catObj.name : "this category"}</h2>
      <div class="grid" id="related">${related.map(card).join("")}</div>`;
    $("#add-btn").addEventListener("click", () => { void addToCart(p.id, +$("#qty").value); });
    $("#buy-btn").addEventListener("click", async () => {
      if (await addToCart(p.id, +$("#qty").value)) location.href = "cart.html";
    });
    document.title = p.title + " — anoshvi.uk";
    wireCards($("#related"));
  }

  function renderCart() {
    const root = $("#cart-root");
    const ids = Object.keys(cart);
    if (!ids.length) { root.innerHTML = "<div class='empty'><h2>Your cart is empty</h2><p>Check out today's deals.</p><a class='btn' href='index.html'>Shop now</a></div>"; return; }
    const rows = ids.map((id) => {
      const p = byId(id); if (!p) return "";
      const q = cart[id];
      const qtyOpts = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}" ${i + 1 === q ? "selected" : ""}>${i + 1}</option>`).join("");
      return `<div class="cart-row" data-row="${id}">
        <img class="ci-img" src="${imgFor(p)}" alt="${p.title}">
        <div>
          <h3><a href="product.html?id=${p.id}">${p.title}</a></h3>
          <p class="instock">In Stock</p>
          ${p.prime ? '<span class="badge-prime">✓ prime FREE delivery</span>' : ""}
          <div class="ctrls">
            <label>Qty: <select data-qty="${id}">${qtyOpts}</select></label>
            <button class="link-btn" data-del="${id}">Delete</button>
          </div>
        </div>
        <div class="price"><span class="cur">${money(p.price * q)}</span></div>
      </div>`;
    }).join("");
    root.innerHTML = `
      <div class="cart-layout">
        <div class="cart-items">
          <h2>Shopping Cart</h2>${rows}
          <p style="text-align:right;font-size:17px">Subtotal (${cartCount()} items): <b>${money(cartSubtotal())}</b></p>
        </div>
        <div class="summary">
          <p style="font-size:16px">Subtotal (${cartCount()} items): <b>${money(cartSubtotal())}</b></p>
          <label style="font-size:13px;display:block;margin:8px 0"><input type="checkbox"> This order contains a gift</label>
          <a class="btn block big" href="checkout.html">Proceed to checkout</a>
        </div>
      </div>`;
    $$("[data-qty]").forEach((s) => s.addEventListener("change", () => { setQty(s.dataset.qty, +s.value); renderCart(); }));
    $$("[data-del]").forEach((b) => b.addEventListener("click", () => { removeItem(b.dataset.del); renderCart(); }));
  }

  function renderWishlist() {
    const root = $("#wish-root");
    const ids = Object.keys(wish);
    const items = ids.map(byId).filter(Boolean);
    if (!items.length) { root.innerHTML = "<div class='empty'><h2>Your wishlist is empty</h2><p>Tap the ♥ on any product to save it.</p><a class='btn' href='index.html'>Shop now</a></div>"; return; }
    root.innerHTML = `<h2 class="section-title">Your Wishlist (${items.length})</h2><div class="grid">${items.map(card).join("")}</div>`;
    wireCards(root);
  }

  function renderCheckout() {
    const root = $("#checkout-root");
    const ids = Object.keys(cart);
    if (!ids.length) { root.innerHTML = "<div class='empty'><h2>Your cart is empty</h2><a class='btn' href='index.html'>Shop now</a></div>"; return; }
    const shipping = cartSubtotal() > 35 ? 0 : 4.99;
    const tax = +(cartSubtotal() * 0.08).toFixed(2);
    const total = cartSubtotal() + shipping + tax;
    root.innerHTML = `
      <div class="checkout-layout">
        <div class="panel">
          <h2>Checkout</h2>
          <form id="checkout-form">
            <h4>Shipping address</h4>
            <div class="form-grid">
              <div class="field"><label>Full name</label><input required placeholder="Jane Doe"></div>
              <div class="field"><label>Phone</label><input required placeholder="+44 …"></div>
              <div class="field full"><label>Address</label><input required placeholder="123 High Street"></div>
              <div class="field"><label>City</label><input required placeholder="London"></div>
              <div class="field"><label>Postcode</label><input required placeholder="SW1A 1AA"></div>
            </div>
            <h4>Payment (demo only)</h4>
            <div class="form-grid">
              <div class="field full"><label>Card number</label><input required placeholder="4111 1111 1111 1111" maxlength="19"></div>
              <div class="field"><label>Expiry</label><input required placeholder="MM/YY"></div>
              <div class="field"><label>CVC</label><input required placeholder="123" maxlength="4"></div>
            </div>
            <p class="note">This is a demo store — do not enter real card details. No payment is processed.</p>
            <button class="btn big" type="submit">Place your order</button>
          </form>
        </div>
        <div class="summary">
          <h3>Order Summary</h3>
          <div class="row"><span>Items (${cartCount()})</span><span>${money(cartSubtotal())}</span></div>
          <div class="row"><span>Shipping</span><span>${shipping === 0 ? "FREE" : money(shipping)}</span></div>
          <div class="row"><span>Est. tax</span><span>${money(tax)}</span></div>
          <hr>
          <div class="row total"><span>Order total</span><span>${money(total)}</span></div>
        </div>
      </div>`;
    $("#checkout-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const order = "AZ-" + Date.now().toString().slice(-8);
      cart = {}; save(KEY_CART, cart); updateCartBadge();
      root.innerHTML = `<div class="empty">
        <h2>✓ Order placed!</h2>
        <p>Thank you for your (pretend) purchase.</p>
        <p>Order number: <b>${order}</b> · Total: <b>${money(total)}</b></p>
        <p class="note">This is a demo storefront; nothing was actually charged or shipped.</p>
        <a class="btn" href="index.html">Continue shopping</a></div>`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderChrome();
    const page = document.body.dataset.page;
    ({ home: renderHome, category: renderCategory, product: renderProduct,
       cart: renderCart, wishlist: renderWishlist, checkout: renderCheckout }[page] || function () {})();
  });

  window.Store = { doSearch, addToCart };
})();
