import sgMail from '@sendgrid/mail'
import { prisma } from '@/lib/prisma'
import { NotificationChannel, NotificationType, OrderStatus } from '@prisma/client'

const apiKey = process.env.SENDGRID_API_KEY
const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'concierge@captainstitches.com'
const fromName = process.env.SENDGRID_FROM_NAME || 'Captain Stitches Atelier'
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'samuelson@captainstitches.com'
const appUrl = process.env.APP_URL || 'http://localhost:3000'

if (apiKey && apiKey.trim() !== '') {
    sgMail.setApiKey(apiKey)
}

export function isEmailServiceConfigured(): boolean {
    return Boolean(apiKey && apiKey.trim() !== '')
}

export interface EmailDispatchRecord {
    id: string
    to: string
    from: string
    subject: string
    category: string
    orderNumber?: string
    isSimulated: boolean
    sentAt: Date
    previewUrl?: string
}

// In-memory ledger of recent email dispatches for testing and auditing
const recentEmailDispatches: EmailDispatchRecord[] = []

export function getRecentEmailDispatches(): EmailDispatchRecord[] {
    return [...recentEmailDispatches]
}

export function clearRecentEmailDispatches(): void {
    recentEmailDispatches.length = 0
}

/**
 * Base luxury email wrapper with Captain Stitches branding,
 * mobile responsive inline styles, and dual atelier footer.
 */
function wrapLuxuryEmailTemplate(params: {
    previewText: string
    headerTitle: string
    headerSubtitle?: string
    bodyHtml: string
    ctaText?: string
    ctaUrl?: string
    secondaryCtaText?: string
    secondaryCtaUrl?: string
}): string {
    const {
        previewText,
        headerTitle,
        headerSubtitle = 'Bespoke Sartorial Elegance · Lagos & Verona',
        bodyHtml,
        ctaText,
        ctaUrl,
        secondaryCtaText,
        secondaryCtaUrl,
    } = params

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerTitle}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0C0704; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: separate; }
    a { text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; padding: 12px !important; }
      .inner-card { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0C0704; color: #FAF7F2;">
  <!-- Preview Text -->
  <div style="display: none; font-size: 1px; color: #0C0704; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${previewText}
  </div>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0C0704; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">
          
          <!-- Brand Header -->
          <tr>
            <td align="center" style="padding: 24px 0 20px 0;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="font-family: Georgia, 'Playfair Display', serif; font-size: 24px; font-weight: 700; letter-spacing: 4px; color: #FAF7F2; text-transform: uppercase;">
                      CAPTAIN STITCHES
                    </span>
                    <div style="font-size: 10px; letter-spacing: 3px; color: #C4975A; text-transform: uppercase; margin-top: 4px; font-weight: 600;">
                      ${headerSubtitle}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Card -->
          <tr>
            <td>
              <table class="inner-card" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #17100B; border: 1px solid #332014; border-radius: 16px; padding: 36px 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                
                <!-- Title & Gold Accent Rule -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #C4975A; text-transform: uppercase; margin-bottom: 6px;">
                      ATELIER ADVISORY
                    </div>
                    <h1 style="margin: 0; font-family: Georgia, 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: #FAF7F2; line-height: 1.3;">
                      ${headerTitle}
                    </h1>
                    <div style="height: 2px; width: 48px; background-color: #C4975A; margin-top: 14px;"></div>
                  </td>
                </tr>

                <!-- Email Body -->
                <tr>
                  <td style="font-size: 14px; line-height: 1.7; color: #D5CCA8;">
                    ${bodyHtml}
                  </td>
                </tr>

                <!-- Action Button (CTA) -->
                ${
                    ctaText && ctaUrl
                        ? `
                <tr>
                  <td align="center" style="padding-top: 32px; padding-bottom: 12px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #C4975A 0%, #A87D43 100%);">
                          <a href="${ctaUrl}" target="_blank" style="font-size: 13px; font-weight: 700; letter-spacing: 1px; color: #0C0704; text-transform: uppercase; text-decoration: none; padding: 14px 32px; border-radius: 12px; display: inline-block;">
                            ${ctaText}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `
                        : ''
                }

                <!-- Secondary Link (e.g. WhatsApp Concierge) -->
                ${
                    secondaryCtaText && secondaryCtaUrl
                        ? `
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <a href="${secondaryCtaUrl}" target="_blank" style="font-size: 12px; font-weight: 600; color: #C4975A; text-decoration: underline;">
                      ${secondaryCtaText} &rarr;
                    </a>
                  </td>
                </tr>
                `
                        : ''
                }

              </table>
            </td>
          </tr>

          <!-- Dual Atelier Footer -->
          <tr>
            <td style="padding: 32px 16px 20px 16px; text-align: center; font-size: 11px; line-height: 1.8; color: #8A7A6E;">
              <p style="margin: 0 0 10px 0;">
                <strong style="color: #FAF7F2;">Captain Stitches Bespoke Atelier</strong><br>
                <strong>Verona:</strong> Via Roma 45, 37121 Verona, Italy &nbsp;•&nbsp; 
                <strong>Lagos:</strong> 14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria
              </p>
              <p style="margin: 0 0 12px 0;">
                Direct WhatsApp Concierge: <a href="https://wa.me/393512345678" style="color: #C4975A; font-weight: 600;">+39 351 234 5678</a> &nbsp;|&nbsp; 
                Email: <a href="mailto:concierge@captainstitches.com" style="color: #C4975A;">concierge@captainstitches.com</a>
              </p>
              <p style="margin: 0; font-size: 10px; color: #5C4E43;">
                &copy; ${new Date().getFullYear()} Captain Stitches. Handcrafted African luxury tailored for the global gentleman.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

/**
 * Universal email dispatcher transmitting via SendGrid when keys exist,
 * or safely recording simulated dispatches during test and sandbox runs.
 */
export async function sendEmail(params: {
    to: string
    subject: string
    html: string
    category: string
    orderId?: string
    orderNumber?: string
    notificationType?: NotificationType
}): Promise<{ success: boolean; messageId?: string; error?: string; isSimulated?: boolean }> {
    const { to, subject, html, category, orderId, orderNumber, notificationType } = params

    try {
        if (isEmailServiceConfigured()) {
            const [response] = await sgMail.send({
                to,
                from: {
                    email: fromEmail,
                    name: fromName,
                },
                subject,
                html,
                categories: [category, 'captain-stitches-atelier'],
            })

            const messageId = response.headers['x-message-id'] as string || `sg-${Date.now()}`

            recentEmailDispatches.unshift({
                id: messageId,
                to,
                from: `${fromName} <${fromEmail}>`,
                subject,
                category,
                orderNumber,
                isSimulated: false,
                sentAt: new Date(),
            })

            // Log notification to Prisma database if orderId is available and exists
            if (orderId && notificationType) {
                try {
                    const orderExists = await prisma.order.findUnique({
                        where: { id: orderId },
                        select: { id: true },
                    }).catch(() => null)

                    if (orderExists) {
                        await prisma.orderNotification.create({
                            data: {
                                orderId,
                                channel: NotificationChannel.EMAIL,
                                type: notificationType,
                                recipient: to,
                                messageContent: subject,
                                sentAt: new Date(),
                                success: true,
                            },
                        })
                    }
                } catch (dbErr) {
                    console.warn('[Email Service] Failed to log order notification in DB:', dbErr)
                }
            }

            return { success: true, messageId, isSimulated: false }
        }

        // Graceful Simulated Dispatch
        const simulatedMessageId = `sim-email-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

        recentEmailDispatches.unshift({
            id: simulatedMessageId,
            to,
            from: `${fromName} <${fromEmail}>`,
            subject,
            category,
            orderNumber,
            isSimulated: true,
            sentAt: new Date(),
        })

        if (recentEmailDispatches.length > 100) {
            recentEmailDispatches.pop()
        }

        console.info(`[Email Service · Simulated SendGrid] To: ${to} | Subject: "${subject}" | Category: ${category}`)

        if (orderId && notificationType) {
            try {
                const orderExists = await prisma.order.findUnique({
                    where: { id: orderId },
                    select: { id: true },
                }).catch(() => null)

                if (orderExists) {
                    await prisma.orderNotification.create({
                        data: {
                            orderId,
                            channel: NotificationChannel.EMAIL,
                            type: notificationType,
                            recipient: to,
                            messageContent: subject,
                            sentAt: new Date(),
                            success: true,
                        },
                    })
                }
            } catch {
                // Non-blocking in mock mode
            }
        }

        return {
            success: true,
            messageId: simulatedMessageId,
            isSimulated: true,
        }
    } catch (err: any) {
        console.error('[Email Service] SendGrid dispatch failure:', err)

        if (orderId && notificationType) {
            try {
                const orderExists = await prisma.order.findUnique({
                    where: { id: orderId },
                    select: { id: true },
                }).catch(() => null)

                if (orderExists) {
                    await prisma.orderNotification.create({
                        data: {
                            orderId,
                            channel: NotificationChannel.EMAIL,
                            type: notificationType,
                            recipient: to,
                            messageContent: subject,
                            sentAt: new Date(),
                            success: false,
                            error: err.message,
                        },
                    })
                }
            } catch {
                // Ignore
            }
        }

        return {
            success: false,
            error: err.message || 'Failed to dispatch email via SendGrid',
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER LIFECYCLE EMAIL TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

export interface OrderEmailContext {
    id: string
    orderNumber: string
    customerName: string
    customerEmail?: string
    customerPhone: string
    deliveryAddress: string
    deliveryLocation: string
    designName: string
    fabric: string
    colour: string
    sizingMode: string
    measurementsSummary?: string
    currency: string
    totalAmount: number
    depositAmount: number
    balanceAmount: number
    deadline?: string
    occasion?: string
    trackingNumber?: string
    courierName?: string
    inspectionMediaUrls?: string[]
}

/**
 * 1. Order Confirmation & 50% Deposit Received:
 * Dispatches confirmation to the customer and commission alert to the atelier admin.
 */
export async function sendOrderConfirmationEmails(order: OrderEmailContext): Promise<{
    customerEmailSuccess: boolean
    adminEmailSuccess: boolean
}> {
    const trackingUrl = `${appUrl}/track?query=${encodeURIComponent(order.orderNumber)}`
    const currencySymbol = order.currency === 'EUR' ? '€' : '₦'

    let customerEmailSuccess = false

    // A. Send Confirmation to Patron (if email provided)
    if (order.customerEmail) {
        const patronHtml = `
          <p>Dear ${order.customerName},</p>
          <p>
            It is our pleasure to confirm that your bespoke commission has been successfully received at the
            <strong>Captain Stitches Atelier</strong>. Your 50% milestone deposit of
            <strong>${currencySymbol}${order.depositAmount.toLocaleString()}</strong> has been authorized.
          </p>
          <div style="background-color: #21160F; border: 1px solid #3D2619; border-radius: 12px; padding: 18px 20px; margin: 24px 0;">
            <div style="font-size: 11px; font-weight: 700; color: #C4975A; text-transform: uppercase; margin-bottom: 8px;">
              Commission Specifications (${order.orderNumber})
            </div>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Garment:</strong> ${order.designName}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Fabric:</strong> ${order.fabric}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Shade:</strong> ${order.colour}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Sizing Fit:</strong> ${order.sizingMode.toUpperCase()}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Occasion:</strong> ${order.occasion || 'Private Commission'}</p>
            ${order.deadline ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Deadline:</strong> ${new Date(order.deadline).toLocaleDateString()}</p>` : ''}
            <div style="border-top: 1px dashed #4D3322; margin-top: 12px; padding-top: 10px;">
              <p style="margin: 4px 0; font-size: 13px;"><strong>Total Value:</strong> ${currencySymbol}${order.totalAmount.toLocaleString()}</p>
              <p style="margin: 4px 0; font-size: 13px; color: #10B981;"><strong>Deposit Settled:</strong> ${currencySymbol}${order.depositAmount.toLocaleString()} (50%)</p>
              <p style="margin: 4px 0; font-size: 13px; color: #D5CCA8;"><strong>Milestone Balance:</strong> ${currencySymbol}${order.balanceAmount.toLocaleString()} (Due only after 4K video inspection approval)</p>
            </div>
          </div>
          <p>
            Our master cutters have scheduled your cloth for pattern drafting. You can inspect the real-time crafting milestones
            of your attire at any moment using our live tracking portal:
          </p>
        `

        const wrappedPatron = wrapLuxuryEmailTemplate({
            previewText: `Commission Confirmed: ${order.designName} (${order.orderNumber})`,
            headerTitle: 'Your Bespoke Commission Is Confirmed',
            bodyHtml: patronHtml,
            ctaText: 'Track Your Commission Live',
            ctaUrl: trackingUrl,
            secondaryCtaText: 'Connect with Verona Concierge on WhatsApp',
            secondaryCtaUrl: 'https://wa.me/393512345678',
        })

        const res = await sendEmail({
            to: order.customerEmail,
            subject: `Commission Confirmed: ${order.designName} [${order.orderNumber}]`,
            html: wrappedPatron,
            category: 'order-confirmed-patron',
            orderId: order.id,
            orderNumber: order.orderNumber,
            notificationType: NotificationType.ORDER_CONFIRMED,
        })
        customerEmailSuccess = res.success
    }

    // B. Send Admin Alert to Samuelson / Master Tailor
    const adminHtml = `
      <p>Master Tailor Samuelson,</p>
      <p>
        A new bespoke commission has been initialized online with deposit settlement.
      </p>
      <div style="background-color: #21160F; border: 1px solid #3D2619; border-radius: 12px; padding: 18px 20px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Order Reference:</strong> ${order.orderNumber}</p>
        <p style="margin: 4px 0;"><strong>Patron Name:</strong> ${order.customerName}</p>
        <p style="margin: 4px 0;"><strong>Phone:</strong> ${order.customerPhone}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> ${order.customerEmail || 'None provided'}</p>
        <p style="margin: 4px 0;"><strong>Destination:</strong> ${order.deliveryAddress} (${order.deliveryLocation})</p>
        <p style="margin: 4px 0;"><strong>Commission:</strong> ${order.designName}</p>
        <p style="margin: 4px 0;"><strong>Fabric:</strong> ${order.fabric} (${order.colour})</p>
        <p style="margin: 4px 0;"><strong>Sizing:</strong> ${order.sizingMode}</p>
        ${order.measurementsSummary ? `<p style="margin: 4px 0;"><strong>Measurements:</strong> ${order.measurementsSummary}</p>` : ''}
        <p style="margin: 4px 0;"><strong>Deposit Received:</strong> ${currencySymbol}${order.depositAmount.toLocaleString()}</p>
      </div>
      <p>Please review customer anatomy specifications and assign to the cutting table.</p>
    `

    const wrappedAdmin = wrapLuxuryEmailTemplate({
        previewText: `New Commission: ${order.customerName} - ${order.designName} (${order.orderNumber})`,
        headerTitle: `New Order Alert: ${order.orderNumber}`,
        bodyHtml: adminHtml,
        ctaText: 'Open Atelier Order Hub',
        ctaUrl: `${appUrl}/admin/orders/${order.id}`,
    })

    const adminRes = await sendEmail({
        to: adminEmail,
        subject: `[New Commission] ${order.orderNumber} - ${order.customerName} (${order.designName})`,
        html: wrappedAdmin,
        category: 'order-confirmed-admin',
        orderId: order.id,
        orderNumber: order.orderNumber,
        notificationType: NotificationType.ORDER_CONFIRMED,
    })

    return {
        customerEmailSuccess,
        adminEmailSuccess: adminRes.success,
    }
}

/**
 * 2. Order Status Milestone Transition Emails:
 * Sends specific notifications to the customer and admin when order status evolves.
 */
export async function sendOrderStatusMilestoneEmail(
    order: OrderEmailContext,
    newStatus: OrderStatus | string,
    notes?: string
): Promise<{ success: boolean; messageId?: string }> {
    if (!order.customerEmail) {
        return { success: true } // No customer email to deliver to
    }

    const trackingUrl = `${appUrl}/track?query=${encodeURIComponent(order.orderNumber)}`
    const currencySymbol = order.currency === 'EUR' ? '€' : '₦'

    let subject = `Order Update: ${order.designName} [${order.orderNumber}]`
    let headerTitle = 'Atelier Production Update'
    let previewText = `Your commission ${order.orderNumber} has progressed to ${newStatus}.`
    let bodyContent = ''
    let ctaText = 'Inspect Progress Live'
    let ctaUrl = trackingUrl
    let notifType: NotificationType = NotificationType.STATUS_UPDATE

    switch (newStatus) {
        case 'IN_PRODUCTION':
            subject = `Pattern Cut & Tailoring Underway: ${order.designName} [${order.orderNumber}]`
            headerTitle = 'Cloth Laid on the Cutting Table'
            previewText = `Your bespoke ${order.designName} is actively being cut and tailored in the atelier.`
            bodyContent = `
              <p>Dear ${order.customerName},</p>
              <p>
                Our master artisans have completed anatomical pattern drafting for your <strong>${order.designName}</strong>.
                Your chosen fabric (<strong>${order.fabric}</strong> in <strong>${order.colour}</strong>) has been precision cut
                and is now being assembled with reinforced bespoke canvas in the atelier.
              </p>
              ${notes ? `<p style="font-style: italic; color: #C4975A;">Atelier Note: ${notes}</p>` : ''}
              <p>
                Every stitch aligns with the high sartorial standards demanded by the Captain Stitches house.
              </p>
            `
            break

        case 'INSPECTION':
            subject = `Artisan Inspection Ready: ${order.designName} [${order.orderNumber}]`
            headerTitle = 'Inspection Photos Uploaded'
            previewText = `High-resolution artisan photos are ready for your inspection.`
            notifType = NotificationType.INSPECTION_READY
            bodyContent = `
              <p>Dear ${order.customerName},</p>
              <p>
                Crafting on your bespoke <strong>${order.designName}</strong> has reached completion.
                High-resolution studio inspection photos and fit media have been uploaded to your private tracking portal.
              </p>
              <div style="background-color: #21160F; border: 1px solid #3D2619; border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #FAF7F2;">
                  📸 <strong>Craftsmanship Sign-off:</strong> Master Tailor Samuelson is currently examining seam alignment,
                  lapel roll tension, and hem drape.
                </p>
              </div>
              <p>You may view the uploaded artisan media directly on your commission tracking portal.</p>
            `
            ctaText = 'View Inspection Photos'
            break

        case 'APPROVED':
            subject = `Quality Sign-off Approved: ${order.designName} [${order.orderNumber}]`
            headerTitle = 'Official Master Tailor Sign-Off'
            previewText = `Samuelson has approved your garment. Settle milestone balance for courier dispatch.`
            notifType = NotificationType.BALANCE_REMINDER
            bodyContent = `
              <p>Dear ${order.customerName},</p>
              <p>
                Master Tailor Samuelson Anaele has personally conducted the rigorous 12-point quality inspection on your
                <strong>${order.designName}</strong> and awarded it the <strong>Official Atelier Seal of Excellence</strong>.
              </p>
              <div style="background-color: #21160F; border: 1px solid #10B981; border-radius: 12px; padding: 18px 20px; margin: 20px 0;">
                <div style="font-size: 11px; font-weight: 700; color: #10B981; text-transform: uppercase; margin-bottom: 6px;">
                  Milestone Balance Settlement
                </div>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Balance Due:</strong> ${currencySymbol}${order.balanceAmount.toLocaleString()}</p>
                <p style="margin: 4px 0; font-size: 12px; color: #D5CCA8;">
                  Settlement of this final 50% milestone releases your attire directly to DHL Express international courier dispatch.
                </p>
              </div>
              ${notes ? `<p style="font-style: italic; color: #C4975A;">Samuelson's Inspection Remarks: "${notes}"</p>` : ''}
            `
            ctaText = 'Approve & Settle Balance'
            ctaUrl = `${appUrl}/order/balance?id=${order.orderNumber}`
            break

        case 'DISPATCHED':
            subject = `Dispatched via ${order.courierName || 'DHL Express'}: ${order.designName} [${order.orderNumber}]`
            headerTitle = 'Your Attire Is In Transit'
            previewText = `Tracking number: ${order.trackingNumber || 'Available in portal'}`
            notifType = NotificationType.DISPATCHED
            bodyContent = `
              <p>Dear ${order.customerName},</p>
              <p>
                Your handcrafted <strong>${order.designName}</strong> has been carefully packed into our luxury breathable
                garment bag and handed over to <strong>${order.courierName || 'DHL International Express'}</strong>.
              </p>
              <div style="background-color: #21160F; border: 1px solid #3D2619; border-radius: 12px; padding: 18px 20px; margin: 20px 0;">
                <p style="margin: 4px 0; font-size: 13px;"><strong>Courier:</strong> ${order.courierName || 'DHL Express'}</p>
                ${order.trackingNumber ? `<p style="margin: 4px 0; font-size: 14px; font-family: monospace; color: #C4975A;"><strong>Tracking Waybill:</strong> ${order.trackingNumber}</p>` : ''}
                <p style="margin: 4px 0; font-size: 13px;"><strong>Destination:</strong> ${order.deliveryAddress}</p>
              </div>
              <p>
                Our concierge monitors your transit coordinates until the package is safely delivered to your doorstep.
              </p>
            `
            ctaText = 'Track DHL Shipment'
            ctaUrl = order.trackingNumber
                ? `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(order.trackingNumber)}`
                : trackingUrl
            break

        case 'DELIVERED':
            subject = `Delivered: Welcome Your Bespoke Attire [${order.orderNumber}]`
            headerTitle = 'Commission Delivered'
            previewText = `Welcome your bespoke attire. Care instructions & exclusive invitation enclosed.`
            notifType = NotificationType.REVIEW_REQUEST
            bodyContent = `
              <p>Dear ${order.customerName},</p>
              <p>
                Our courier records show that your bespoke commission <strong>${order.orderNumber}</strong> has arrived safely.
                May it accompany your finest milestones with grace and distinction.
              </p>
              <div style="background-color: #21160F; border: 1px solid #3D2619; border-radius: 12px; padding: 18px 20px; margin: 20px 0;">
                <div style="font-size: 11px; font-weight: 700; color: #C4975A; text-transform: uppercase; margin-bottom: 6px;">
                  Atelier Garment Care Protocol
                </div>
                <ul style="margin: 6px 0; padding-left: 20px; font-size: 13px; line-height: 1.6;">
                  <li>Store on the provided contoured cedar wood hanger.</li>
                  <li>Steam gently from the inside out; avoid direct scorching iron contact on embroidery.</li>
                  <li>Specialist dry clean only when necessary.</li>
                </ul>
              </div>
              <p>
                We would be deeply honored if you shared your impressions with us. Submitting your review unlocks
                an exclusive <strong>10% ambassador discount</strong> on your subsequent commission.
              </p>
            `
            ctaText = 'Leave a Review & Claim 10% Off'
            ctaUrl = `${appUrl}/review?order=${encodeURIComponent(order.orderNumber)}`
            break

        default:
            bodyContent = `
              <p>Dear ${order.customerName},</p>
              <p>Your order <strong>${order.orderNumber}</strong> has been updated to <strong>${newStatus}</strong>.</p>
              ${notes ? `<p>Note: ${notes}</p>` : ''}
            `
    }

    const wrappedHtml = wrapLuxuryEmailTemplate({
        previewText,
        headerTitle,
        bodyHtml: bodyContent,
        ctaText,
        ctaUrl,
        secondaryCtaText: 'Inquire with Atelier Concierge',
        secondaryCtaUrl: 'https://wa.me/393512345678',
    })

    return sendEmail({
        to: order.customerEmail,
        subject,
        html: wrappedHtml,
        category: `order-status-${newStatus.toLowerCase()}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        notificationType: notifType,
    })
}

/**
 * 3. Newsletter Welcome Email:
 * Dispatches a warm welcome to new subscribers with an exclusive discount code.
 */
export async function sendNewsletterWelcomeEmail(email: string): Promise<{ success: boolean; messageId?: string }> {
    const welcomeHtml = `
      <p>Esteemed Patron,</p>
      <p>
        Welcome to the <strong>Captain Stitches Private Circle</strong>.
      </p>
      <p>
        As a subscriber, you are granted priority access to limited seasonal fabric drops—including our Imperial
        Cashmere Cottons and royal brocades sourced directly between Nigeria and Italy—as well as private seasonal
        editorials on diaspora wedding etiquette and sartorial mastery.
      </p>
      <div style="background-color: #21160F; border: 1px solid #C4975A; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
        <span style="font-size: 11px; font-weight: 700; color: #FAF7F2; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 8px;">
          Your Welcome Privilege Voucher
        </span>
        <span style="font-family: monospace; font-size: 20px; font-weight: 700; color: #C4975A; letter-spacing: 4px;">
          ROYALTY10
        </span>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #D5CCA8;">
          Enjoy 10% off your initial bespoke commission online or via WhatsApp consultation.
        </p>
      </div>
      <p>
        Explore our curated collection of Grand Agbadas, Senator ensembles, and bespoke Italian cut suits:
      </p>
    `

    const wrapped = wrapLuxuryEmailTemplate({
        previewText: 'Welcome to the Captain Stitches Private Circle · ROYALTY10 voucher enclosed',
        headerTitle: 'Welcome to the Atelier Circle',
        bodyHtml: welcomeHtml,
        ctaText: 'Explore Bespoke Catalogue',
        ctaUrl: `${appUrl}/catalogue`,
        secondaryCtaText: 'Book a 5-Minute Virtual Consultation',
        secondaryCtaUrl: 'https://wa.me/393512345678',
    })

    return sendEmail({
        to: email,
        subject: 'Welcome to Captain Stitches Atelier · ROYALTY10 Privilege Enclosed',
        html: wrapped,
        category: 'newsletter-welcome',
    })
}
