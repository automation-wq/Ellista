# Mytekkstore Online Store — Gap analysis against reference stores

Date: 2026-10-05. Compared with Croma (the layout reference), Samsung.com/in (the feel reference), Flipkart and Reliance Digital, the stores Indian shoppers compare an electronics site against. The comparison is against their public storefronts' well-known patterns.

Everything on the site is React (web/src, built into public/). Every page is a React shell with one root element and the one bundle; there is no plain-HTML page left.

## 1. Where the store already matched the reference stores

- Header with offer ticker, category mega menus (tiles, popular products, guides), search, country, account, wishlist and cart counts.
- Cinematic hero slider with a spotlight deal, numbers band, category tiles, bento, category blocks, brand cards, bank offers, festive banner, trust tiles.
- Category pages with explore-by-size tiles, size tabs, lifestyle headline, Top features band and the TV size guide.
- Product page with gallery and zoom, feature strip, EMI per month, size switcher, stock bar, delivery pincode check with district lookup, bank offers box, "Complete your home" bundle, share, tabs, reviews with rating bars, compare table, related and recently viewed rows, sticky sub-nav.
- Cart drawer and cart page, sign-in before checkout, one-time code by SMS or email, password and Google sign-in, order tracking page, account with orders and saved address.
- Festive offers page, No Cost EMI tags, wishlist, recently viewed, reviews, admin.
- Web standards: SEO tags and structured data per page, sitemap, robots, gzip, caching, security headers, web app manifest, skip link, analytics events.

## 2. Gaps found and closed in this pass

| Gap | What the reference stores do | Mytekkstore before | Mytekkstore now |
|---|---|---|---|
| Search suggestions | Croma, Flipkart and Amazon suggest products, categories and brands as you type, with trending searches before typing | Plain box that opened the results page | Suggestions as you type: products with photo and price, categories, brands, "See all results"; the biggest deals before typing; arrow keys, Enter and Escape work; screen-reader combobox roles |
| Faceted filters | Croma and Flipkart have a sidebar of checkboxes (brand, price, discount, rating, availability) with counts, applied-filter chips and a filter sheet on phones | Four drop-downs (category, brand, price cap, sort) that reloaded the page | Sidebar with brand (multi-select), price band, discount, in stock, No Cost EMI, 4★ and above, each with a count; applied chips with × and Clear all; sort pill; a bottom sheet behind a "Filters (n)" pill on phones; filters apply at once and stay in the address |
| Phone navigation | Croma and Flipkart apps and sites keep Home, Categories, Cart and Account one tap away at the bottom | Header links only | Fixed bottom bar on phones: Home, Shop, Deals, Cart (with count), Account |
| Delivery location in the header | Amazon, Flipkart and Croma show "Deliver to <pincode>" in the header | Pincode only on the product page and at checkout | "Deliver to" chip beside the search box; the pincode is remembered for product pages and the checkout |
| Delivery date | Reference stores show "Get it by <date>" on cards, product pages and at checkout | "Usually in 3 to 5 days" | Dates on product cards, the product page pill and pincode result, the checkout summary and the order page ("Expected delivery by …"), worked out from the same 3 to 5 day promise |
| EMI plans | Croma and Flipkart open a table of EMI plans per tenure | One "From ₹x/month" line | "View EMI plans" opens a 3 / 6 / 9 month table with the per-month amount and total, on products with the EMI flag |
| Cart suggestions | Amazon and Flipkart show "You may also like" in the cart | Items and total only | A row of the best deals not yet in the cart |
| Profile editing | Every reference store lets the customer edit name, phone and address | Address saved only by placing an order | "Edit profile" on the account page, with a server route and test |
| Footer trust row | Croma and Reliance Digital repeat the trust points in the footer | Links and copyright only | Trust row: no card details stored, cash on delivery, easy returns, brand warranty, free delivery |

## 3. Gaps that need something from the client before they can be built

| Gap | What is needed |
|---|---|
| Real online payment (UPI, cards, net banking) | A payment gateway account (Razorpay or PayU). The checkout is a demo payment today |
| Coupon and promo codes at checkout | The real codes and their terms; about a day to add to the admin and checkout |
| Several saved addresses, address book | A decision on whether customers need more than one address |
| Brand logo strip, payment-method logos, social links | Official logos and the store's social handles |
| Store pickup and a real store locator | Store addresses and hours |
| Product questions and answers, review photos, verified-purchase badges | Real customers; the reviews feature already exists |
| Exchange offers, extended warranty, installation booking | Partners and prices for each |
| Cancel or return an order from the account | The returns policy and who approves a return |
| GST invoice option | The business's GST details |
| WhatsApp chat button | A WhatsApp Business number |
| Delivery areas, charges and real courier estimates | The delivery partner's pincode list and timelines; today every 6-digit pincode is accepted and the dates come from the 3 to 5 day promise |

## 4. Gaps left out on purpose

- A compare checkbox on product cards: every product page already compares the product with three similar models, and a catalogue of nine products does not need a compare tray.
- Pagination or infinite scroll: not needed until the catalogue is much larger.
- App download banners: there is no app.
- A header that shrinks on scroll: tried and dropped, it jumps the page content (APP_DESIGN section 8).
