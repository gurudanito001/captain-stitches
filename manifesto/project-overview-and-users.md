# Project Overview & Users

## 1. Overview and Business Context

CaptainStitches is a bespoke fashion business founded by Samuelson Anaele. The company operates out of Verona, Italy and Lagos/Aba, Nigeria. Production includes native Nigerian wear (agbada, senator, kaftan), English suits, and casual clothing. The primary customer base consists of Nigerians in Europe seeking quality custom outfits delivered directly to them. This PRD outlines Web Application V2.0, designed to replace the current informal WhatsApp ordering process.

## 2. Business Goals

- Transition from an informal WhatsApp process to a structured, trackable system.
- Provide a professional online storefront for customers to browse, review, and order.
- Eliminate customer uncertainty by providing clear order tracking.
- Capture customer emails to build relationships and support ongoing marketing.
- Expand international reach by supporting English and Italian languages, along with Naira and Euro currencies.
- Drive referrals from satisfied customers via a built-in reward programme.
- Build brand authority through SEO-optimised pages and a regularly updated blog.
- Architect the system to support a future subscription model.

## 3. User Roles

- **Customer (Public):** Target audience includes Nigerians in Italy, the UK, Europe, and Nigeria needing bespoke native or corporate attire. They are primarily mobile users who will order in either English or Italian.
- **Admin (Samuelson Anaele):** The owner requires full access to all admin features, including orders, customers, catalogue, blog, referrals, and settings. The admin system must be fully functional on mobile to accommodate travel between Italy and Nigeria.
- **Tailor (Limited Admin):** Production staff based in Nigeria. Access is restricted to updating order statuses and uploading inspection photos/videos. They cannot access financial data or broader customer profiles outside their assigned orders.

## 4. Requirements & Constraints

- **Mobile-First:** The platform must prioritize mobile responsiveness, as most customers order via phone and the admin requires full mobile access.
- **Performance:** All public-facing pages must load in under 3 seconds on a standard mobile connection.
- **Security:** Customer data must be stored securely, and the admin area must be protected by an authenticated login utilizing Role-Based Access Control (RBAC).
- **Localisation:** All emails must be delivered in the customer's preferred language (English or Italian).
- **Scalability:** The architecture must allow for the addition of future languages and currencies without requiring structural changes.

## 5. Out of Scope for V1

- Activation of live subscription billing (the provision will be built but kept dormant).
- Languages other than English and Italian.
- Currencies other than Naira (₦) and Euro (€).
- Automated API integrations for shipping and couriers.
- A native mobile application.
- A customer login portal (V1 will rely on tracking via order ID).