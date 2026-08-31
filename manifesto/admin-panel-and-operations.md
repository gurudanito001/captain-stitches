# Admin Panel & Operations

## 1. Admin Dashboard Features

- **Overview:** Real-time widgets displaying active orders, items awaiting deposit, items ready for inspection, monthly deliveries, new referral signups, and subscriber counts. Overdue flags trigger when deadlines pass.
- **Orders Board (Kanban):** A drag-and-drop board (using `dnd-kit`) managing the order flow. Cards display the customer, outfit type, location, deadline, and deposit status. Admins can click to view details, upload media, one-tap WhatsApp the customer, or manually create orders for WhatsApp-based customers. Status changes trigger relevant automated notifications.
- **Customer Profiles:** Stores structured measurement fields to auto-fill future orders, order history (with photos), delivery address, referral count, email, administrative notes, and a subscription status field. Features a one-click WhatsApp link.
- **Reviews Moderation:** A queue system where Samuelson can approve, reject, or flag submitted reviews. Approvals instantly update the status and re-render the associated design page.
- **Catalogue Manager:** A CMS interface to add/edit designs, assign categories, reorder items, set independent ₦ and € pricing, toggle visibility (hiding items without deleting), and mark items as featured for the homepage.
- **Referral Tracker:** Monitors the top referrers leaderboard, manages rewards and redemptions, and tracks conversion rates.
- **Email & Marketing:** Interfaces with the Mailchimp/Brevo API to view the subscriber list, send broadcast emails, and monitor open/click rates.
- **Blog Editor:** A rich text editor that allows scheduling posts, applying SEO categories/tags, adding feature images, inputting meta fields, authoring English/Italian variants, and previewing content before publishing.
- **Settings:** Configuration for locations, garment turnaround times, payment setups, WhatsApp number, FX rate toggles, notification rules, Role-Based Access Control (Admin vs. Tailor), and dormant subscription settings.

---

## 2. Order Flow State Machine

The system relies on a rigid progression states, requiring Samuelson's personal sign-off before dispatch.

| Status | Meaning | Updated by |
| :--- | :--- | :--- |
| **New** | Order placed, awaiting deposit. | System. |
| **Confirmed** | 50% deposit received via payment gateway. | Auto. |
| **In production** | Tailor working on the outfit. | Tailor. |
| **Inspection** | Tailor complete; Samuelson reviews video. | Tailor. |
| **Approved** | Samuelson signed off on quality. No order moves past Inspection without this approval. | Samuelson. |
| **Dispatched** | Item shipped to customer location. | Samuelson. |
| **Delivered** | Customer confirmed receipt. | Customer/Admin. |

---

## 3. Subscription Provision (Dormant)

The architecture must support subscriptions, protected by a feature flag to allow future activation without a system rebuild.

- The customer account model includes a `subscription_status` field (inactive by default).
- A database table defines hidden subscription tiers: Standard, Priority, VIP.
- Paystack and Stripe integrations must be configured for recurring billing capability but remain disabled.
- The Admin settings feature a hidden "Subscriptions" section that Samuelson can unlock when ready.