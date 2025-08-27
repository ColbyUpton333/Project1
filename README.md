# YumYard — Online Food Ordering (Static Demo)

A responsive, Bootstrap-based web app for browsing a menu, adding to cart, checking out, managing a simple profile, and an **admin** area for managing menu items and tracking orders. No real backend—data loads from static JSON and “writes” persist via `localStorage`.

### Admin credentials
- **Email:** `admin@demo.com`
- **Password:** `Admin!234`

## Project Structure
```
/admin
  ├─ index.html         # dashboard (guarded)
  └─ login.html         # admin login
/assets
  ├─ css/styles.css
  └─ js/
      ├─ utils.js, api.js, menu.js, cart.js, checkout.js, profile.js, app.js
      └─ admin/auth.js, menu-admin.js, orders-admin.js
/data
  ├─ menu.json          # 25 seeded items
  └─ settings.json      # taxRate, currency, deliveryFee
index.html
README.md
PROJECT_PLAN.md
LICENSE
```
## Test checklist (≈10 minutes)
- [ ] Menu renders with cards and prices.
- [ ] Search, category filters, Veg/Vegan toggles work.
- [ ] Sort by price asc/desc and popularity works.
- [ ] “Add” adds items; cart badge updates.
- [ ] Cart drawer: +/–, remove, clear cart works; totals recalc.
- [ ] Checkout: validation blocks submit until all fields valid and cart has items.
- [ ] Placing order empties cart, shows confirmation with generated Order ID.
- [ ] Profile: Save and reload page—values persist.
- [ ] Admin login with demo credentials.
- [ ] Admin menu CRUD reflects changes back on Home.
- [ ] Admin orders: when an order is placed, status can be updated.

## Notes on Implementation
- **HTML**: Semantic structure with ARIA attributes for modal/drawer handled by Bootstrap.
- **CSS**: A light theme via CSS variables and minimal custom styles; Bootstrap grid/utilities for layout.
- **JavaScript**: Modular ES modules (`type="module"`). `menu.js` handles rendering and filters, `cart.js` manages state, `checkout.js` validates and places orders, `profile.js` persists user info.
- **AJAX (mocked)**: Initial data fetch from `/data/*.json`. Writes/updates simulate server calls by writing to `localStorage` with artificial latency in `api.js`.
- **Accessibility**: Keyboard navigable components via Bootstrap, form validation messages, and focusable controls.
- **Performance**: Lightweight, no frameworks; cached settings/menu in `localStorage` after first load.
