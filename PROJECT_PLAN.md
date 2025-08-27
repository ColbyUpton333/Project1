# PROJECT_PLAN — Mapping to Spec

## Scope (User)
- **Home/Menu**: category filters, search, sort (price/popu), responsive card grid — *`menu.js` + `index.html`*
- **Item Details**: simplified “Add” from card; (modal scaffold in `index.html`, extendable to show options)
- **Cart**: offcanvas drawer with qty updates, remove, clear, subtotal/tax/total — *`cart.js`*
- **Checkout**: form validation + summary + place order — *`checkout.js`*
- **Orders**: confirmation screen with Order ID — *`checkout.js` after submit*
- **Profile**: update and persist name/email/address — *`profile.js`*

## Scope (Admin)
- **Admin Login**: client-side mock auth (admin@demo.com / Admin!234) — *`admin/login.html`, `admin/auth.js`*
- **Dashboard**: Menu CRUD + Orders list with status change — *`admin/index.html`, `menu-admin.js`, `orders-admin.js`*
- **Guarded**: redirect to login if missing token — *`auth.js`*

## Data & AJAX
- **Seed JSON** in `/data`: `menu.json` (25 items), `settings.json` (tax, currency, delivery).
- **MockAPI** module `api.js`: fetch seed data, then “persist” to `localStorage`; includes artificial latency.

## UI Requirements
- Bootstrap 5 with small custom theme, reusable cards, offcanvas cart, toast feedback.

## Validation & Rules
- Prevent add if out-of-stock (disabled Add button).
- Totals = subtotal + tax + delivery (from settings).
- Form validation and disabled “Place Order” until valid and cart has items.

## Git & Run
- No build step. Use Live Server or a simple static server. Suggested commit slices in README.

## Extensibility
- Add item-options in modal, pagination, coupons, and images under `/images` folder.
