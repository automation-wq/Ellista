# Launch readiness: is the Mytekkstore website ready to open?

Checked on 5 October 2026 against the running store. This is the plain answer for the client, with the evidence behind it. The technical detail lives in TRD.md; this page only says what is ready, what is not, and what happens next.

## 1. The short answer

| Question | Answer |
|---|---|
| Can the client see and try the whole store today? | **Yes.** Run `start.bat` on any PC with Node.js, or `go-live.bat` for a public https link to share. Every page, the cart, sign-in, checkout, orders and the admin work end to end. |
| Can real customers buy from it today? | **Not yet.** Nothing is missing in the software. The store is waiting on content and accounts that only the client can supply (section 4). Until then it shows a sample catalogue with generated photos, sample bank offers and placeholder policy pages. |
| How long after the client supplies them? | One to two weeks of our work (TRD section 9). |

## 2. What works today

Every item below was exercised by the automated checks on 5 October 2026: `node test.js` (the API: accounts, orders, stock, admin, request safety) and `node test-ui.js` (a real headless browser on a desktop and a phone screen, through the menus, filters, cart, keyboard and touch, plus a crawl of every link on the main pages).

| Area | What a visitor gets |
|---|---|
| Home | Hero slider with the best deal of each category, numbers band, category tiles, shop-by-size rows (every screen size and capacity on sale, with its starting price), "Built for your home" bento, deals of the day, a block per category, brand cards, customer quotes from real reviews, bank offers, festive banner, trust strip, "Good to know" answers |
| Categories | Explore-by-size tiles, size tabs, filters with counts (brand, size, price, discount, stock, EMI, rating) that stay in the address, sort, a Top features band, and the interactive TV size guide on Televisions |
| Products | Photo gallery with zoom, feature strip, price with savings, No Cost EMI plans, size switcher, stock bar, delivery date and pincode check (India Post lookup), bank offers, "Complete your home" add-ons, share buttons, description, grouped specifications, delivery and returns, reviews, compare table, related products |
| Offers | Festive page with offers by category, top deals, bank offers and the No Cost EMI band |
| Cart and checkout | Cart drawer, cart page with suggestions, checkout with address and pincode, cash on delivery or demo online payment, order confirmation with delivery dates |
| Account | Sign-in by mobile number code, email code, Google or password; order history with status; profile editing; wishlist; recently viewed |
| Admin | Orders and status updates, products with photo upload and the No Cost EMI flag, outbox of customer messages (sign-in is in `data/ADMIN_LOGIN.txt`) |
| Search and SEO | Live search suggestions, server-written page titles and sharing tags, product data for Google, sitemap and robots files |
| Phone | Every page fits a phone screen, with a bottom bar, a filter sheet and touch-friendly menus |

## 3. How the store stays up

The client asked that the site must never fall over. These are the measures in place and what each one covers.

| Risk | What happens now |
|---|---|
| A bug in one request | The request gets a clean error message; the store keeps serving everyone else. An unexpected error is written to the store window, never fatal. |
| The server process stops for any reason | `start.bat` runs it in a watch loop and starts it again within 3 seconds. |
| `start.bat` is run twice | The second copy notices the store is already running and closes quietly. |
| The PC loses power while an order is being saved | Every data file is written to a temporary file first and swapped in whole, so a file is either the old version or the new one, never half-written. |
| A data file is damaged or deleted | A dated copy of every data file is kept in `data/backups/` (one per day, 14 days). A damaged file stops the store with a message naming the backup folder, so no data is silently replaced. |
| A page fails to draw in the browser | The visitor sees a message with a way back to the home page instead of a blank screen. |
| The pincode lookup service is slow or down | The check gives up after 6 seconds and the standard delivery promise still shows. |
| Someone tries to pay a different price or buy more than is in stock | Prices and stock are always checked on the server, never trusted from the browser. |
| Password guessing | Sign-in attempts are rate-limited per address and per account. |
| Malformed or oversized requests | Rejected before they reach the store logic. |

Honest limits of the current setup: it is one server process with JSON files, which suits a small store; customers are signed out when the server restarts; and while the store runs on the client's PC, it is up only while that PC and `start.bat` are. For the public launch it goes on a hosting service (section 5), which keeps it on around the clock.

## 4. What the client must provide before real customers come

| Item | Why it blocks the launch | Status |
|---|---|---|
| Real product list: names, prices, MRP, stock, specifications, photos | The site shows 9 sample products with generated photos | Waiting |
| Logo and brand colours | The site uses a placeholder wordmark and the green accent we chose | Waiting |
| Company details and policy text: address, phone, email, GST number, shipping, returns, terms, privacy | The policy pages are marked "sample text" | Waiting |
| Real bank offers and EMI terms, and which products carry No Cost EMI | The offers shown are samples | Waiting |
| Payment gateway account (for example Razorpay) for cards and UPI | Today only cash on delivery is real; online payment is a demo | Waiting |
| Hosting, a domain and HTTPS | The store runs on a PC; a public site needs a server that is always on | Waiting, client pays hosting |
| Free keys for sign-in codes: Brevo (email) and a Google client id; Twilio if SMS codes are wanted | Without them sign-in codes only work on the demo link with `OTP_DEMO=1` | Waiting (steps in TRD section 11) |
| Delivery areas and charges, if delivery is not free everywhere | The site promises free delivery in 3 to 5 days and accepts any pincode | To confirm |

## 5. Steps to open to the public

1. Client sends the items in section 4. We load the catalogue through the admin and apply the logo and colours.
2. We put the folder on a Node host (Render's web service or any small VPS) with the domain and HTTPS, setting `HOST=0.0.0.0` and `TRUST_PROXY=1`.
3. We set the Brevo, Google and (optional) Twilio keys on the host so sign-in codes and order messages are delivered.
4. We connect the payment gateway and run test orders on a phone and a desktop.
5. The client reads the policy pages and the Good to know answers once more and approves the wording.
6. `OTP_DEMO` is removed and the site opens.

## 6. Showing it before then

With the store running, `go-live.bat` opens a free Cloudflare quick tunnel and prints an https address that lasts while the window is open. Add `set OTP_DEMO=1` to `start.bat` first so sign-in codes appear on the page during the walkthrough.
