# Mytekkstore Online Store — App Design

The visual rules for every page. Layout follows the recommended reference, Croma: bold and image led. The colour theme is white, as requested by the client.

## 1. Design principles

1. **Images do the selling.** Large banners and clean product photos on every screen.
2. **Clean and white.** A white page with light grey bands keeps attention on product photos. Hero and promo banners stay dark for contrast.
3. **One accent colour.** It is used only for actions and prices that matter.
4. **Dense but tidy.** Many products per screen, like a real retail store, with clear spacing.
5. **Phone first.** Every block is designed for a phone and then widened for desktop.

## 2. Colours

| Use | Colour | Note |
|---|---|---|
| Page background | `#f4f5f7` | |
| Header and footer | `#ffffff` | |
| Cards | `#ffffff` | With a light border |
| Lines and borders | `#e2e5ea` | |
| Main text | `#15181e` | |
| Secondary text | `#6b7280` | |
| Body copy | `#3f4652` | CSS variable --soft |
| Text on accent | `#ffffff` | CSS variable --on: buttons and badges |
| Accent | `#08805f` | Placeholder. Replace with Mytekkstore's brand colour **[CONFIRM]** |
| Product photo background | `#ffffff` | White tiles so real product photos look consistent |

## 3. Type

- Font: Inter (headings and body). Fallback: system font.
- Sizes: hero title 44–52 px, section title 22–24 px, product name 14 px, price 18 px bold, small text 13 px.
- Prices use the country's own number format, for example ₹1,00,769.

## 4. Layout

- Maximum content width 1200 px, 16 px side margin on phones.
- Product grid: 2 columns on phones, 3 on tablets, 5 on desktop.
- Corner radius: 12 px on cards and banners, 6 px on buttons and inputs.
- Section spacing: 44 px.

## 5. Components

| Component | Design |
|---|---|
| Header | Sticky, frosted white. Offer ticker, logo, search box with live suggestions (products with photo and price, categories, brands; the biggest deals before typing), "Deliver to" pincode chip, country selector, account, wishlist and cart with counts |
| Category bar | Light strip under the header: Televisions, Washing Machines, Air Conditioners, Brands, Deals. The name itself is the control; there are no arrow buttons. Scrolls sideways on phones |
| Category menu | Opens under the bar when a name is hovered (desktop), tapped once (phone) or reached with Tab. Size or capacity tiles and brand tiles, four popular models, a Discover list, and a promo card for the TV size guide. The page behind is dimmed |
| Explore tiles | Sideways-scrolling tiles at the top of a category page (TVs by Size, each brand, 4K Ultra HD, Google TV, the other categories) that wrap on desktop and swipe on phones (no scroll line or arrow buttons: the client rejected them); size tabs below |
| Top features | Dark green band with six line-icon tiles per category and the category's room clip playing faintly behind them |
| TV size guide | White card on the Televisions page only: viewing-distance slider, drawing of sofa and screen, recommended size, Shop button and a size table |
| Hero slider | Full-width cinematic banners, 3 slides (TV, washing machines, AC), slow zoom with the aurora light, auto-rotating every 5 seconds with a filling progress bar per slide, arrows, two pill buttons per slide (Shop now, See deals), and a floating glass "spotlight" card at the bottom right with that category's best deal (photo, name, price, discount). Stock video was tried here and dropped: the clips looked cheap next to the banners |
| Numbers band | Four white cards under the hero with a figure that counts up when they scroll in: biggest discount, 9 months No Cost EMI, number of bank offers, 100% genuine. Every figure comes from the catalogue or the bank offer list, never typed in |
| Bento grid | "Built for your home": a 4-column dark grid, one big photo tile (TVs) and one small tile per other category, each with the first two Top features of that category (so the copy only claims what the specifications support), plus a wide green glass tile with the lowest No Cost EMI per month |
| Shop by size row | White card per category: category name with "by size" or "by capacity", one price chip per size on sale (the product page's size swatch style) linking to that size's filtered list, and on Televisions a "Not sure?" link to the size guide |
| Customer quote | White card: star row, the review text in quotes, the reviewer's name and the product; the whole card links to the product. Lifts on hover like the trust tiles |
| Good to know | Native details/summary cards with a plus that turns into a minus when open; the open card gets the accent border. Answers are plain text with at most one link |
| Specifications groups | The product's specification rows grouped under uppercase headings (General, Display, Sound, Smart features, Connectivity, Performance, Warranty) picked by the specification's name; empty groups are left out |
| Category block | One per category, the Samsung home-page pattern: a lifestyle banner (dark gradient on the left, category, "Explore by size" headline, from-price, biggest discount, model count, white pill button) and four product cards under it |
| Category tile | Three full-width tiles on the home page: the category's lifestyle photo fills the tile, a dark gradient at the bottom carries the name, model count and "from ₹…" price, "Shop now →" appears on hover, and the product photo floats top-right as a small tilted white card. Stacked one per row on phones |
| Product gallery | Big zoomable photo, thumbnail strip when more photos exist, and a feature strip of up to six specifications with line icons below it (like the reference product page) |
| Product sub-nav | Desktop only, Samsung style: once Add to cart scrolls away, a bar slides in under the header with the product name, Overview / Specs / Compare / Reviews (the one in view is underlined), the price and Add to cart |
| Category banner | The "Explore … by Size" headline sits on a lifestyle photo (living room, laundry, bedroom) with a dark gradient and a slow parallax as you scroll |
| Buttons and search | Pill shaped (fully rounded), like Samsung's |
| Brand card | Large gradient card with the brand name, product count and "Explore →" (logos to come from the client) |
| Product card | Photo on white, brand, 2-line name, price, struck-through MRP, "Save ₹x" pill, discount badge, No Cost EMI tag, "Free delivery · get it by <date>" line, Add to cart |
| Deal badge | Small red-orange gradient label on the photo corner, for example "34% off" |
| Wide banner | One dark wide banner that opens the Offers page |
| Bank offer card | White card with a coloured bank wordmark (real logos to come from the client), the headline offer, one line of terms and "T&C apply"; a light sweeps across it on hover |
| No Cost EMI tag | Small mint label under the price on cards and product pages, shown only on products with the EMI flag set in the admin |
| Icons | One SVG line-icon set (24 px grid, 1.8 px rounded stroke) everywhere: offer ticker, header, perks, Top features, feature strip, trust strip, compare table. No emoji anywhere, so icons look the same on every phone and computer |
| Add-on box | "Complete your home" on every product page, like the reference's accessories box: this product plus one ticked product from each other category (same brand first), a live total and one "Add all to cart" button |
| Compare table | On every product page: this product (tinted, "This product" chip) beside up to three similar models in photo columns; rows for price (with a "Lowest price" chip), rating, each specification, No Cost EMI and Add to cart. Rows where the models differ carry a green dot and bold values. Scrolls sideways on phones |
| Sign-in card | Two columns: a dark photo panel with three benefits on the left, a white card on the right with the Google button (when set up), a Mobile number / Email tab bar and the forms. The code field is large and spaced |
| Trust strip | Four tiles with self-drawing line icons: delivery, genuine products, cash on delivery, order tracking |
| Filters | Faceted sidebar on desktop (brand, price band, discount, in stock, No Cost EMI, 4★ and above, each with a count); a bottom sheet behind a "Filters (n)" pill on phones; applied filters as green chips with ×; sort in a pill select above the grid |
| Phone bottom bar | Fixed, frosted bar on phones: Home, Shop, Deals, Cart (with count), Account; the current one is green |
| EMI plans | "View EMI plans" under the per-month line opens a small 3 / 6 / 9 month table (a native details element, no script) |
| Deliver to | Pill chip in the header with a pin icon, "Deliver to" and the district and pincode; opens a small pop-over with the pincode field |
| Buttons | Primary: green gradient fill with white text. Secondary: outline |
| Footer | Trust row (no card details stored, cash on delivery, easy returns, brand warranty, free delivery) over four link columns and copyright. Contact details, social icons and payment icons wait for the client |

## 6. Page layouts

**Home**
1. Header and category bar
2. Hero slider with the spotlight card
3. Numbers band (counts up)
4. Shop by category tiles
5. Shop by size rows: one row per category, a chip per size on sale with its starting price; the TV row links to the size guide
6. Built for your home bento (category tiles, No Cost EMI tile)
7. Deals of the day grid
8. One category block each for Televisions, Washing Machines and Air Conditioners: banner plus four products
9. Shop by brand cards
10. What customers say: the six newest reviews across the catalogue, each a card linking to its product (hidden until a review exists)
11. Recently viewed row
12. Bank offers
13. Wide festive banner (opens the Offers page)
14. Why Mytekkstore trust strip
15. Good to know: seven questions as native details/summary in two columns (one on phones); every answer repeats a promise the site already makes (FAQ in data.js)
16. Footer

**Offers:** festive hero (purple-to-green gradient, rising gold and teal sparks, shimmering headline, "up to X% off", one button per category, countdown when an end date is set), offers by category tiles with the category picture, top deals grid, bank offers, No Cost EMI band.

**Sign in:** photo panel on the left, sign-in card on the right. On phones the photo panel sits above the card.

**Category / Brand / Search:** breadcrumb, "Explore … by Size" headline, explore tiles, size tabs, product count, filters on the left (above the grid on phones), product grid, then the Top features band and, for Televisions, the size guide. No pagination: the catalogue is small.

**Product:** gallery on the left (photo, thumbnails, feature icon strip). On the right: brand, name, rating, price block with the EMI-per-month line, stock and a stock bar when 10 or fewer are left, size swatches with prices, a free delivery pill, an Offers box with the top three bank offers, the Complete your home add-on box, Add to cart, Buy now and wishlist heart on one row, pincode delivery check, perks strip, share links. A compact buy bar follows on desktop. Below: tabs for description, specifications, delivery and reviews, then the Compare table, "More in …" and recently viewed rows.

**Cart:** item list on the left, order summary box on the right. On phones the summary sits at the bottom.

**Checkout:** steps on the left (address, payment), order summary on the right.

## 7. Images

| Image | Size | Count | Source for prototype | Source for launch |
|---|---|---|---|---|
| Hero banners | 1600 wide, 16:9 | 3 (living room at dusk with the TV, laundry room, bedroom with the AC) | Generated for this store in one cinematic style (October 2026) | Client offers, designed |
| Category tiles | 400x400 | 3 | AI generated | Same or client photos |
| Lifestyle photos | 1600 px wide JPEG | 3 (kv-tv, kv-wash, kv-ac in public/img) | Pexels photos 6636297, 19846385, 6316054: free licence, commercial use, no attribution | Client's own photos, or keep these |
| Hero and tile clips | 960x540 MP4, 1.5 to 3 MB each | 3 (v-tv, v-ac, v-wash in public/img) | Pexels videos 7184588, 7239171, 15432350: free licence, commercial use, no attribution | Client's own clips, or keep these |
| Promo banners | 800x400 | 3 | AI generated (in public/img, not used on the current home page) | Client offers |
| Product photos | 800x800, white background | 1 per sample product | Generated in one studio style: same angle, same lighting, no logos; TV screens show a teal-blue gradient | Real photos from the client |
| Brand logos | 300x140 | 1 per brand | Brand name as text | Official logos supplied by the client |
| Mytekkstore logo | vector | 1 | Text logo | Client |

Rules for generated images: no brand logos or brand names inside the image, same lighting and angle for all product photos, dark studio look for banners.

## 8. Motion

Everything here switches off when the device asks for reduced motion.

Since 2026-10-06 the storefront's motion runs on **Motion** (motion.dev, the `motion` package, React 19): the hero parts and headline words rise on springs with a stagger (variants in `web/src/home.jsx`), sections fade and rise as they scroll in and the numbers count up through Motion's `inView` and `animate` (`web/src/motion.js`), the cart drawer slides on a spring, the toast pops in and out with `AnimatePresence`, the top progress line is a sprung scroll value (`Chrome` in `web/src/components.jsx`), and the add-to-cart photo flies with `animate`. `MotionConfig reducedMotion="user"` in `main.jsx` makes every Motion animation honour the visitor's setting. Hover tilts, Ken Burns zooms, glows and the scroll-driven parallax stay in CSS. If the bundle size matters later, switch to `LazyMotion` with `domAnimation` and the `m` components (about 20 KB gzip smaller).

### 8.1 What moves today

- Hero: slides fade every 5 seconds and pause on hover, with a progress bar that fills under the active slide; the headline rises word by word; the picture zooms slowly and drifts toward the pointer (parallax); a soft aurora light drifts over it; the headline shimmers; the spotlight card floats gently; the whole banner shrinks a little as you scroll past it. Video is used only in the Top features bands, where it sits faintly behind the tiles.
- Numbers band: each figure counts up from 0 over 1.4 seconds the first time it scrolls into view (shown at once when the visitor prefers reduced motion).
- Bento and category banners: photos move slower than the page (CSS scroll-driven animation, no JavaScript, in browsers that support it) and zoom on hover; tiles enter one after another; the arrow link slides right on hover; the glass tiles carry a drifting glow.
- Product cards show a "Save ₹…" pill next to the struck-out MRP.
- Sections fade up as they scroll into view; cards enter one after another; headings draw their underline.
- Product cards tilt in 3D toward the pointer, with a soft light that follows it; the photo zooms slightly; the heart appears; the discount badge pulses.
- Add to cart: the photo flies to the cart icon, the count bumps, and the button turns into a quantity stepper.
- Category tiles: the clip zooms slowly and the product card straightens on hover; "Shop now" slides in. Scroll arrows on product rows show only when the row really overflows.
- Brand cards: slow moving gradient. The wide offer banner and the Top features band have a glowing light that drifts and moves at a different speed to the page (parallax).
- Why Mytekkstore: line icons draw themselves when the section appears and fill green on hover (no emoji).
- Offers page: sparks rise behind the festive headline, which shimmers; category offer tiles lift and tilt their picture on hover; bank offer cards enter one after another and get a light sweep on hover.
- Order placed: a short confetti burst over the green tick.
- Top features band: the category's room clip fades in behind the tiles when the band scrolls into view.
- Category banner: the photo moves slower than the page (parallax); eyebrow, headline and line rise in one after another.
- Product sub-nav: slides down under the header; the underline moves to the section in view.
- Product page: the stock bar fills on load, the delivery dot pulses, the buy bar slides up, thumbnails lift on hover.
- Not done on purpose: a header that shrinks on scroll (it would jump the page content by the ticker's height).
- Motion reference: samsung.com, for feel only (reveals, pill controls, sticky product sub-nav, parallax banners), never for content.
- Sign-in page: the photo panel zooms slowly.
- Search suggestions and the Deliver-to pop-over rise in; the filter sheet slides up on phones and the page behind dims; filter chips fill green on hover.
- Category menus fade in under the bar and the page behind dims.
- Offer ticker scrolls across the top and pauses on hover. Scroll progress bar at the top, back-to-top button after 300 px. Toasts slide up. Skeleton shimmer while loading.
- Not used on purpose: scroll lines with arrow buttons under tile rows (client decision, 2026-10-04); page-to-page view transitions (they throw console errors when a link opens a non-HTML file such as the sitemap, tried twice, dropped on 2026-10-04). Tile rows wrap on desktop and swipe on phones.

### 8.2 What can be added next (pick, then say go)

| Idea | What the visitor sees | What it needs | Cost |
|---|---|---|---|
| Video hero | 6 to 8 second looping clip behind the headline: TV glowing in a living room, AC with cool mist, washing machine drum turning | 2 or 3 clips from Pexels (free licence, commercial use, no attribution), trimmed and saved as small MP4 or WebM in public/img with a poster image | free |
| Living-room banners | Hero and wide banners use lifestyle photos (TV on a wall, AC in a bedroom, washer in a laundry room) instead of studio shots | 3 to 6 images from the Gemini API free tier (about 500 images a day, no card) or Pexels photos | free |
| Product hover video | Hovering a product card plays a 3 second clip (screen lights up, drum spins) | 1 clip per product from the client or Pexels; wait for the real product list | free |
| Category tile videos | The three category tiles play a short loop instead of a still picture | 3 Pexels clips | free |
| Deals countdown | "Ends in 04:12:33" on Deals of the Day | a real end time per deal from the client (admin field); it must not be fake | free |
| 360 degree product view | Drag to spin the product | 12 to 24 photos per product from the client | free once photos exist |
| Gallery cross-fade and zoom | Thumbnails cross-fade; pinch or hover to zoom | more than one photo per product | free |
| Brand logo strip | Logos glide across the page | official logos from the client | free |
| Counters ("2,000+ happy customers") | Numbers count up on scroll | real numbers from the client; never invented | free |
| Smart sticky header | Header shrinks and the logo gets smaller after scrolling | nothing | free |
| Animated logo | The bolt in the logo flashes once on load | the final logo from the client | free |
| Lottie illustrations | Drawn animations (delivery van driving, and so on) | a 60 KB library plus one JSON file per animation, and a CSP change | free but heavier pages |

Client decision (2026-10-04): use free sources (Pexels, Gemini API free tier) rather than paid credits. Phone OTP by SMS is the one thing that is never free (Firebase gives 10 SMS a day free; Twilio only a trial credit).

Rules for video: under 2 MB per clip, muted, looping, with a poster image, and no autoplay on phones with data saver on. Banner copy still follows the marketing copy rule (only claim what the catalogue supports).

## 9. Accessibility

- Text contrast of at least 4.5 to 1.
- All images have alt text. Icon-only buttons have labels.
- Everything can be reached and used with the keyboard. Category menus open when their name is reached with Tab and close with Escape.
- Tap targets are at least 40 px high on phones.
