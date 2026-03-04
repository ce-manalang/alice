import type { OrderItem } from '@/app/lib/types'

interface OrderNotificationEmailProps {
  reference: string
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  notes?: string | null
  items: OrderItem[]
  total: number
}

/** Plain React email template for Resend — no react-email package needed */
export function OrderNotificationEmail({
  reference,
  customerName,
  customerEmail,
  customerPhone,
  notes,
  items,
  total,
}: OrderNotificationEmailProps) {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        New Order: {reference}
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        A new order has been submitted through the centimentalcomics shop.
      </p>

      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
        Customer Details
      </h2>
      <table style={{ borderCollapse: 'collapse', marginBottom: '1.5rem', width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ padding: '0.25rem 0.75rem 0.25rem 0', fontWeight: 500, width: '120px' }}>Name</td>
            <td style={{ padding: '0.25rem 0' }}>{customerName}</td>
          </tr>
          <tr>
            <td style={{ padding: '0.25rem 0.75rem 0.25rem 0', fontWeight: 500 }}>Email</td>
            <td style={{ padding: '0.25rem 0' }}>
              <a href={`mailto:${customerEmail}`}>{customerEmail}</a>
            </td>
          </tr>
          {customerPhone && (
            <tr>
              <td style={{ padding: '0.25rem 0.75rem 0.25rem 0', fontWeight: 500 }}>Phone</td>
              <td style={{ padding: '0.25rem 0' }}>{customerPhone}</td>
            </tr>
          )}
          {notes && (
            <tr>
              <td style={{ padding: '0.25rem 0.75rem 0.25rem 0', fontWeight: 500 }}>Notes</td>
              <td style={{ padding: '0.25rem 0' }}>{notes}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
        Order Items
      </h2>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '1.5rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <th style={{ padding: '0.5rem 0', textAlign: 'left', fontWeight: 600 }}>Product</th>
            <th style={{ padding: '0.5rem 0', textAlign: 'center', fontWeight: 600 }}>Qty</th>
            <th style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600 }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.productId} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '0.5rem 0' }}>{item.productName}</td>
              <td style={{ padding: '0.5rem 0', textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>
                PHP {(item.price * item.quantity).toFixed(0)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} style={{ padding: '0.75rem 0', fontWeight: 700 }}>Total</td>
            <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 700 }}>
              PHP {total.toFixed(0)}
            </td>
          </tr>
        </tfoot>
      </table>

      <p style={{ fontSize: '0.875rem', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
        Arrange meetup at your convenience. Reply to this email or contact the customer directly.
      </p>
    </div>
  )
}
