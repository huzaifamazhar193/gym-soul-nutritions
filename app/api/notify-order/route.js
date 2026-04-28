export async function POST(request) {
  try {
    const { customerEmail, customerName, orderId, newStatus, orderTotal, city, items } = await request.json()

    if (!process.env.RESEND_API_KEY) {
      return Response.json({ success: false, error: 'RESEND_API_KEY not set' })
    }

    const statusMessages = {
      confirmed:  'We have received your order and it has been confirmed!',
      processing: 'Your order is being carefully prepared and packed.',
      shipped:    'Great news! Your order has been shipped and is on its way to you.',
      delivered:  'Your order has been delivered successfully. Enjoy your supplements!',
      cancelled:  'Your order has been cancelled. Please contact us if you have any questions.',
    }

    const statusColors = {
      confirmed:  '#3b82f6',
      processing: '#eab308',
      shipped:    '#a855f7',
      delivered:  '#22c55e',
      cancelled:  '#ef4444',
    }

    const color   = statusColors[newStatus] || '#f97316'
    const message = statusMessages[newStatus] || `Your order status has been updated to ${newStatus}.`

    let parsedItems = []
    try { parsedItems = typeof items === 'string' ? JSON.parse(items) : (items || []) } catch(_) {}

    const itemRows = parsedItems.map(i =>
      `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #27272a;color:#d4d4d8;font-size:13px;">${i.name}${i.flavor && i.flavor !== 'N/A' ? ' - ' + i.flavor : ''}${i.size ? ' (' + i.size + ')' : ''}</td>
        <td style="padding:8px 0;border-bottom:1px solid #27272a;color:#a1a1aa;font-size:13px;text-align:center;">x${i.qty}</td>
        <td style="padding:8px 0;border-bottom:1px solid #27272a;color:white;font-weight:600;font-size:13px;text-align:right;">Rs.${(i.price * i.qty).toLocaleString()}</td>
      </tr>`
    ).join('')

    const statusLabel = newStatus.charAt(0).toUpperCase() + newStatus.slice(1)

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Order Update - Gym Soul</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:32px 16px;">

    <!-- Logo Header -->
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);border-radius:16px;padding:14px 28px;">
        <p style="color:white;margin:0;font-size:22px;font-weight:900;letter-spacing:2px;">GYM SOUL</p>
        <p style="color:rgba(255,255,255,0.75);margin:2px 0 0;font-size:10px;letter-spacing:3px;">NUTRITIONS</p>
      </div>
    </div>

    <!-- Status Banner -->
    <div style="background:#18181b;border:1px solid #27272a;border-left:4px solid ${color};border-radius:12px;padding:20px 24px;margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <div style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;"></div>
        <span style="color:${color};font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;">${statusLabel}</span>
      </div>
      <h2 style="color:white;margin:0 0 6px;font-size:17px;font-weight:700;">Order Status Update</h2>
      <p style="color:#a1a1aa;margin:0;font-size:13px;line-height:1.6;">Hi ${customerName}, ${message}</p>
    </div>

    <!-- Order Info -->
    <div style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:20px 24px;margin-bottom:16px;">
      <p style="color:#71717a;text-transform:uppercase;letter-spacing:1px;font-size:11px;font-weight:600;margin:0 0 14px;">Order Summary</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;color:#a1a1aa;font-size:13px;width:40%;">Order ID</td>
          <td style="padding:6px 0;color:#f97316;font-weight:700;font-size:13px;font-family:monospace;text-align:right;">${orderId}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#a1a1aa;font-size:13px;">Delivery City</td>
          <td style="padding:6px 0;color:white;font-size:13px;text-align:right;">${city || 'N/A'}</td>
        </tr>
      </table>

      ${itemRows ? `
      <div style="border-top:1px solid #27272a;margin:14px 0;"></div>
      <table style="width:100%;border-collapse:collapse;">
        ${itemRows}
      </table>` : ''}

      <div style="border-top:1px solid #27272a;margin-top:10px;padding-top:12px;display:flex;justify-content:space-between;align-items:center;">
        <span style="color:white;font-weight:700;font-size:14px;">Total Amount</span>
        <span style="color:#f97316;font-weight:900;font-size:18px;">Rs.${orderTotal?.toLocaleString()}</span>
      </div>
    </div>

    <!-- CTA Button -->
    <div style="text-align:center;margin-bottom:28px;">
      <a href="https://gymsoul.vercel.app/orders"
         style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:white;text-decoration:none;padding:14px 36px;border-radius:12px;font-weight:700;font-size:14px;letter-spacing:0.5px;">
        Track My Order
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;border-top:1px solid #1c1c1e;padding-top:20px;">
      <p style="color:#52525b;font-size:12px;margin:0 0 4px;">Gym Soul Nutritions | Pakistan</p>
      <p style="color:#3f3f46;font-size:11px;margin:0;">This is an automated email. Please do not reply.</p>
    </div>

  </div>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Gym Soul Nutritions <onboarding@resend.dev>',
        to: [customerEmail],
        subject: `Order ${orderId} - ${statusLabel}`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[notify-order] Resend error:', err)
      return Response.json({ success: false, error: err })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[notify-order] Error:', err)
    return Response.json({ success: false, error: err.message })
  }
}
