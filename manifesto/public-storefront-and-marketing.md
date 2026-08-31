# Public Storefront & Marketing

## 1. Public-Facing Pages

- **Homepage:** Includes the brand story, featured designs, customer testimonials, an "Order your piece" Call to Action (CTA), and a sitewide floating WhatsApp button. Features an email capture form offering an incentive (e.g., "Get 10% off your first order") connected to Mailchimp/Brevo, and a header language toggle (English/Italian) utilizing `next-intl` or `i18next`.
- **Design Catalogue:** Allows filtering by category (native wear, suits, casual, children's). Designs display photos, pricing (₦ or €), fabric options, turnaround time, and approved star ratings. Clicking "Order this design" pre-fills the order form, and users can also upload personal design references.
- **Order Page:** A guided multi-step form moving through design choice, measurements (with illustrated diagrams), personal details, occasion/deadline, and a 50% deposit payment. Order confirmation is sent via WhatsApp and email, containing an order ID and tracking link.
- **Order Tracking:** A public status page where customers enter their order ID or phone number to view live status via a visual stepper, estimated delivery dates, and tailor inspection photos, without needing to log in.
- **Customer Reviews:** A post-delivery WhatsApp and email prompt asks for a star rating and written review. Approved reviews calculate into the design's average rating and feed the homepage testimonial section.
- **Referral Programme:** Generates a unique referral link after a customer's first confirmed order. Both the referrer and the new customer receive rewards (discount, free item, or priority slot) upon conversion. A customer dashboard tracks referral counts, earned rewards, and redemption statuses.
- **Blog:** Contains categories for design opinions, case studies, style guides, and brand news. Posts are rendered as static pages for fast indexing, and every post concludes with a CTA directing to the catalogue or order page.
- **About & Contact:** A static page detailing Samuelson's dual-location brand story. Includes a WhatsApp button, email enquiry form, both physical addresses, and utilizes `LocalBusiness` schema markup.

---

## 2. Language & Currency

- **Language Integration:** The UI supports English and Italian via a header toggle using `i18next` or `next-intl` (`en.json`, `it.json`). Dynamic content, such as blog posts and product descriptions, is authored per language and stored in the database.
- **Currency Support:** Prices can be switched between Naira (₦) and Euro (€) via a browser preference toggle. Conversion happens at the display layer using rates fixed by Samuelson or pulled from a live FX API.

---

## 3. Payment Gateway

- **Deposit Model:** A 50% deposit is required at order placement, with the balance due prior to dispatch. The admin generates a balance payment link and sends it via WhatsApp with a single tap.
- **Paystack (Naira):** Supports card, bank transfer, and USSD for Nigerian customers. Selected server-side at checkout. A webhook automatically confirms the order status upon success.
- **Stripe (Euro):** Handles card payments for European customers via the Payment Intents API. Selected server-side, utilizing a webhook to auto-confirm orders and trigger WhatsApp notifications.

---

## 4. SEO Strategy

- **On-Page SEO:** Implemented via the Next.js Metadata API. Pages require unique meta titles, descriptions, canonical URLs, image alt text, H1→H2→H3 heading hierarchies, and Schema.org structured data (`LocalBusiness`, `Product`, `Article`, `Review`).
- **Content SEO:** Target long-tail keywords (e.g., "agbada tailor in Italy", "Nigerian suit delivery Europe", "bespoke senator wear UK") informed by pre-launch keyword research. Requires a minimum of 2 blog posts per month.
- **Technical SEO:** Includes an auto-generated `Sitemap.xml` submitted to Google Search Console, a configured `Robots.txt` excluding admin routes, and performance monitoring via Search Console and Lighthouse.

---

## 5. Email Capture & Marketing

- **Capture Points:** Emails are captured on the homepage via a discount incentive and automatically stored during order placement.
- **Post-Delivery Triggers:** Automated emails for review requests and referral programme invitations.
- **Infrastructure:** Utilizes Mailchimp or Brevo via API for broadcast campaigns. Transactional emails utilize Resend or a similar platform. All emails respect the customer's language preference.