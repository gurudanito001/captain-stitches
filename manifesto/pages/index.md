# Public Pages & Directory Structure

This document outlines the public-facing pages, their routes, and the shared components for the **CaptainStitches** web application.

---

## 1. Public Pages

### 🏠 Homepage (`/`)
* **Navbar:** Includes logo, navigation links, language toggle (English/Italian), currency toggle (₦/€), and WhatsApp button.
* **Hero Section:** Engaging title, brand proposition, and a clear Call to Action (CTA).
* **Featured Designs Grid:** Showcases a curated list of top bespoke designs.
* **How It Works:** A clear, 3-step process detailing how to order custom attire.
* **Customer Testimonials:** Social proof and reviews from satisfied clients.
* **Referral Programme Teaser:** Encourages sharing in exchange for rewards.
* **Blog Preview:** Displays the latest 3 blog posts.
* **Email Capture Banner:** Dynamic newsletter subscription for discounts/updates.
* **Footer:** Sitewide links, copyright, and social media handles.

### 👗 Design Catalogue (`/catalogue`)
* **Category Filter Tabs:** Fast switching between Native Wear, Suits, Casual, and Children's Wear.
* **Search Bar:** Real-time text search for designs.
* **Design Cards Grid:** Displaying product photo, name, price (dynamic currency), star ratings, and turnaround time.
* **Empty State:** User-friendly message when no designs match filters.

### 🔍 Design Detail (`/catalogue/[slug]`)
* **Photo Gallery:** High-resolution product images.
* **Product Details:** Design name, description, and currency-aware pricing (₦/€).
* **Customization Options:** Selection for fabric type, color preference, and style tweaks.
* **Production Time:** Clear display of expected turnaround time.
* **Social Proof:** Star rating, total reviews count, and a list of customer reviews.
* **Call to Action:** Primary "Order this design" button.
* **Related Designs:** Carousel of other designs from the same or matching category.

### 📝 Order Form (`/order`)
* **Step 1 — Design Selection:** Select from the catalogue or upload custom designs/references.
* **Step 2 — Measurements:** Guide to inputting body measurements with illustrative helper diagrams.
* **Step 3 — Personal Details:** Name, email, phone number, and delivery address.
* **Step 4 — Deadline & Occasion:** Specific occasion type and requested deadline.
* **Step 5 — Summary & Payment:** Order summary and 50% deposit payment gateway (Paystack/Stripe).

### 🎉 Order Confirmation (`/order/confirmation`)
* **Success Message:** Confirms successful placement and payment.
* **Order Details:** Order ID and order summary.
* **Tracking:** Direct link to the live tracking page.
* **Next Steps:** Explains what the tailor and admin will do.
* **Support:** Direct WhatsApp contact button.

### 📍 Order Tracking (`/track`)
* **Input Portal:** Access using Order ID or phone number.
* **Visual Stepper:** Live status timeline (New ➔ Confirmed ➔ In Production ➔ Inspection ➔ Approved ➔ Dispatched ➔ Delivered).
* **Estimated Delivery:** Target delivery date based on real-time production.
* **Inspection Media:** View tailor-uploaded photos/videos of the finished garment (active at the inspection stage).
* **Support CTA:** Quick help button linking to WhatsApp.

### 👥 Referral Programme (`/referral`)
* **Overview:** Program guidelines and rewards explanation.
* **Rewards Tier:** Breakdown of discounts, freebies, or priority slots.
* **Sharing Suite:** Quick share links (WhatsApp, Instagram) and custom referral link copy.
* **Referrals Dashboard:** Personal statistics tracking referral counts and reward redemptions.

### ✍️ Blog (`/blog`)
* **Hero Section:** Featured or pinned post with high-quality image.
* **Category Filters:** Filter posts by style guide, brand news, or fashion trends.
* **Blog Post Grid:** Cards displaying featured image, title, read time, excerpt, date, and category.

### 📄 Blog Post (`/blog/[slug]`)
* **Header:** Featured image, title, category, date, and tags.
* **Rich Text Content:** Fully rendered post body with inline media.
* **Social Sharing:** Quick share options for social networks.
* **CTA Banner:** Contextual banner linking to the catalogue or custom order form.
* **Related Posts:** Links to read other relevant articles.

### 📖 About (`/about`)
* **Founder's Story:** Samuelson Anaele's vision and brand journey.
* **Dual-Location Showcase:** Highlighting operations in Verona, Italy, and Lagos/Aba, Nigeria.
* **Meet the Tailors:** Celebrating the production team and craftsmanship.
* **Brand Values:** Focus on premium quality, fit accuracy, and cultural heritage.

### 📞 Contact (`/contact`)
* **Direct Channels:** Floating/primary WhatsApp button and email contact form.
* **Physical Addresses:** Details for both Verona and Nigeria headquarters.
* **Response SLA:** Note setting expectations on typical response times.
* **Location Maps:** Embedded maps showing operating zones (optional).

---

## 2. Shared Components

These are reusable UI components built to ensure consistency across the application:

* **Header/Navbar:** Persistent navigation, language toggles, and currency selectors.
* **Footer:** Standardized sitewide links, branding, and socials.
* **WhatsApp Floating Button:** Constant channel for customer support.
* **Design Card:** Consistent card structure for catalogue and listing grids.
* **Review Card:** Formatted testimonial display with star ratings.
* **Blog Post Card:** Standard thumbnail card for blogs.
* **Step Indicator:** Visual tracker for multi-step forms (e.g., checkout/order form).
* **Skeleton Loaders:** Content placeholders for smooth loading states.
* **Toast Notifications:** Alert system for user feedback (e.g., "Item added", "Copied to clipboard").
* **Empty State Component:** Reusable prompt for empty search/filter queries.