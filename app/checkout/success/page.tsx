import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { OrderItem } from '@/app/lib/types'

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>
}

interface OrderRow {
  id: string
  reference: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  notes: string | null
  items: OrderItem[]
  total: number
  status: string
  created_at: string
}

function formatPrice(price: number): string {
  return `PHP ${price.toFixed(0)}`
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const orderId = params.orderId

  if (!orderId) {
    notFound()
  }

  // Use service role key for server-side order read
  // The anon key cannot read orders (RLS restricts SELECT to service role only)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    // Graceful fallback if service role key not configured
    return (
      <div className="shop-page shop-confirmation-page">
        <div className="shop-container">
          <div className="shop-confirmation-header">
            <div className="shop-confirmation-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="shop-confirmation-title">Order Placed!</h1>
            <p className="shop-confirmation-reference">
              Your order has been received. Check your email for confirmation.
            </p>
          </div>
          <div className="shop-confirmation-meetup">
            <strong>What happens next?</strong>
            <br />
            You will be contacted at the email address you provided to arrange a meetup for pickup.
            No payment is needed at this time — payment is handled in person.
          </div>
          <div className="shop-confirmation-actions">
            <Link
              href="/shop"
              className="shop-btn-primary"
              style={{ display: 'inline-block', width: 'auto' }}
            >
              Continue browsing
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Fetch order with service role key (bypasses RLS)
  const adminSupabase = createClient(supabaseUrl, serviceRoleKey)
  const { data: order, error } = await adminSupabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single<OrderRow>()

  if (error || !order) {
    notFound()
  }

  return (
    <div className="shop-page shop-confirmation-page">
      <div className="shop-container">

        {/* Success header */}
        <div className="shop-confirmation-header">
          <div className="shop-confirmation-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="shop-confirmation-title">Order Confirmed!</h1>
          <p className="shop-confirmation-reference">
            Reference: <strong>{order.reference}</strong>
          </p>
        </div>

        {/* Customer details */}
        <div className="shop-confirmation-card">
          <h2 className="shop-confirmation-card__title">Your Details</h2>
          <div className="shop-confirmation-card__row">
            <span className="shop-confirmation-card__label">Name</span>
            <span className="shop-confirmation-card__value">{order.customer_name}</span>
          </div>
          <div className="shop-confirmation-card__row">
            <span className="shop-confirmation-card__label">Email</span>
            <span className="shop-confirmation-card__value">{order.customer_email}</span>
          </div>
          {order.customer_phone && (
            <div className="shop-confirmation-card__row">
              <span className="shop-confirmation-card__label">Phone</span>
              <span className="shop-confirmation-card__value">{order.customer_phone}</span>
            </div>
          )}
          {order.notes && (
            <div className="shop-confirmation-card__row">
              <span className="shop-confirmation-card__label">Notes</span>
              <span className="shop-confirmation-card__value">{order.notes}</span>
            </div>
          )}
        </div>

        {/* Order items */}
        <div className="shop-confirmation-card">
          <h2 className="shop-confirmation-card__title">Items Ordered</h2>
          {(order.items as OrderItem[]).map((item) => (
            <div key={item.productId} className="shop-confirmation-card__row">
              <span className="shop-confirmation-card__label">
                {item.productName}{' '}
                <span style={{ color: '#9ca3af' }}>× {item.quantity}</span>
              </span>
              <span className="shop-confirmation-card__value">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="shop-confirmation-total">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>

        {/* Meetup instructions */}
        <div className="shop-confirmation-meetup">
          <strong>What happens next?</strong>
          <br />
          <br />
          You will be contacted at <strong>{order.customer_email}</strong>
          {order.customer_phone ? ` or ${order.customer_phone}` : ''} to arrange a convenient
          meetup for pickup. Payment is handled in person — no online payment needed.
          <br />
          <br />
          Keep your order reference <strong>{order.reference}</strong> handy for your records.
        </div>

        {/* Continue browsing */}
        <div className="shop-confirmation-actions">
          <Link
            href="/shop"
            className="shop-btn-primary"
            style={{ display: 'inline-block', width: 'auto' }}
          >
            Continue browsing
          </Link>
        </div>

      </div>
    </div>
  )
}
