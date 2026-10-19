# Nappi Autoworks website

Node/Express + SQLite site with a build-request form and a password-protected lead dashboard.

## Run locally
```
npm install
cp .env.example .env   # fill in values
npm start              # http://localhost:3000
```
Admin dashboard: `/admin` (password only — ADMIN_PASSWORD).

## Deploy on Render
- New Web Service from the GitHub repo. If the code sits in a subfolder, set Root Directory to that folder.
- Build: `npm install` · Start: `npm start`
- Node is pinned to 20.x (`.node-version` + `engines`) because better-sqlite3 has no prebuilt binary for newer Node.
- Add the env vars from `.env.example` (SESSION_SECRET, ADMIN_PASSWORD, NOTIFY_EMAIL, SMTP_*). Set NODE_ENV=production.
- Attach a persistent disk mounted at `db/` or leads reset on each deploy.

## Shop (Stripe Payment Links)
The Shop tab (`/shop`) is driven by one file: `public/js/shop-data.js`. No database, no cart, no order system.
1. In Stripe: Product catalog → add product → **Create payment link**. For sizes, add a custom field (Dropdown) on the payment link. Turn on shipping address collection and Stripe Tax if needed.
2. Paste the `https://buy.stripe.com/...` link into that product's `stripeLink`.
3. When all links are in, set `SHOP_PREVIEW = false`.
While `SHOP_PREVIEW` is true, products without a link show "Buy now" that tells shoppers checkout opens soon and points them to Instagram / phone.
Tee, hoodie and sticker images are logo mockups for the preview. Swap in real product photos (or Printful/Printify mockups) before launch.

## Instagram
Photo grid on both pages links to @nappiautoworks. To embed real posts, paste post/Reel URLs into `public/js/instagram-posts.js`.

## Link previews
Sharing the site in a text or on Facebook shows the Nappi logo (`images/share-logo.jpg`). Set `SITE_URL` in Render to the final domain so previews use it; otherwise the request host is used. After launch, re-scrape once in Facebook's Sharing Debugger.

## Structure
- `server.js` entry point · `db/` SQLite setup · `lib/` mailer + auth · `routes/` build requests + admin · `views/` admin pages · `public/` site

## Open items before launch
- NOTIFY_EMAIL / SMTP sender inbox (no business email found yet)
- Change the admin password
- Confirm TikTok handle (linked as @nappiboy03)
- Confirm only "Buxton, ME" should show (street address left off on purpose)
- Merch: confirm products, prices ($32 hat / $28 tee / $55 hoodie / $5 sticker are placeholders), sizes, shipping vs local pickup
- Create Stripe account under Joe's business and the payment links
- OK to feature the kid-in-hat photo publicly
- Domain: client buys and owns it (e.g. nappiautoworks.com), then update og:image to the full URL
