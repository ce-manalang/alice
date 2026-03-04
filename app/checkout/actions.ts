'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { datocmsRequest } from '@/app/lib/datocms'
import { OrderNotificationEmail } from '@/app/lib/emails/order-notification'
import type { Product, OrderItem, OrderInsert } from '@/app/lib/types'

// ─── Zod validation schema ────────────────────────────────────────────────────

const checkoutSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  // Phone is optional — accept any format or empty string (international formats vary)
  phone: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

// ─── Server-side Supabase client (service role bypasses RLS) ─────────────────

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, serviceKey || anonKey)
}

// ─── DatoCMS query to fetch fresh prices server-side ─────────────────────────

const CHECKOUT_PRODUCTS_QUERY = `
  query CheckoutProducts($ids: [ItemId]!) {
    allProducts(filter: { id: { in: $ids } }) {
      id
      name
      price
    }
  }
`

// ─── Reference number generation ─────────────────────────────────────────────

function generateReference(uuid: string): string {
  // Take first 4 characters of UUID (hex), uppercase them: CC-A3F2
  const shortCode = uuid.replace(/-/g, '').substring(0, 4).toUpperCase()
  return `CC-${shortCode}`
}

// ─── Server Action ────────────────────────────────────────────────────────────

export async function submitOrder(
  prevState: unknown,
  formData: FormData,
): Promise<{ error: string; formData?: Record<string, unknown> } | never> {
  // 1. Extract and validate form fields
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    notes: formData.get('notes') || undefined,
  }

  const validation = checkoutSchema.safeParse(rawData)
  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
      formData: rawData as Record<string, unknown>,
    }
  }

  // 2. Parse cart items from hidden form field
  //    The checkout page serializes cart items as JSON in a hidden input named "cartItems"
  const cartItemsRaw = formData.get('cartItems')
  if (!cartItemsRaw || typeof cartItemsRaw !== 'string') {
    return { error: 'Your cart is empty. Please add items before checking out.' }
  }

  let cartItems: Array<{ productId: string; quantity: number }>
  try {
    cartItems = JSON.parse(cartItemsRaw)
  } catch {
    return { error: 'Invalid cart data. Please refresh and try again.' }
  }

  if (!cartItems.length) {
    return { error: 'Your cart is empty. Please add items before checking out.' }
  }

  // 3. Re-fetch current prices from DatoCMS server-side (prevents stale-price fraud)
  const productIds = cartItems.map((item) => item.productId)
  let freshProducts: Product[]
  try {
    const data = await datocmsRequest<{ allProducts: Product[] }>(
      CHECKOUT_PRODUCTS_QUERY,
      { ids: productIds },
    )
    freshProducts = data.allProducts || []
  } catch {
    return { error: 'Failed to verify product prices. Please try again.' }
  }

  // 4. Build order items using server-fetched prices (never trust client-sent totals)
  const productMap = new Map(freshProducts.map((p) => [p.id, p]))
  const orderItems: OrderItem[] = []

  for (const cartItem of cartItems) {
    const product = productMap.get(cartItem.productId)
    if (!product) {
      // Product no longer exists — skip it
      continue
    }
    orderItems.push({
      productId: cartItem.productId,
      productName: product.name,
      quantity: cartItem.quantity,
      price: product.price,
    })
  }

  if (!orderItems.length) {
    return { error: 'All items in your cart are now unavailable. Please return to the shop.' }
  }

  // 5. Calculate total server-side
  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // 6. Insert order into Supabase
  const orderData: Omit<OrderInsert, 'reference'> & { reference?: string } = {
    customer_name: validation.data.name,
    customer_email: validation.data.email,
    customer_phone: validation.data.phone || null,
    notes: validation.data.notes || null,
    items: orderItems,
    total,
    status: 'pending',
  }

  const serverSupabase = getServerSupabase()
  const { data: insertedOrder, error: dbError } = await serverSupabase
    .from('orders')
    .insert({
      ...orderData,
      reference: 'TEMP', // Will be updated after UUID is known
    })
    .select('id')
    .single()

  if (dbError || !insertedOrder) {
    console.error('Order insert failed:', dbError)
    return { error: 'Failed to save your order. Please try again.' }
  }

  // 7. Generate reference number from UUID and update the record
  const reference = generateReference(insertedOrder.id as string)
  await serverSupabase
    .from('orders')
    .update({ reference })
    .eq('id', insertedOrder.id)

  // 8. Send seller notification via Resend (async — don't block order success on email)
  const resendApiKey = process.env.RESEND_API_KEY
  const sellerEmail = process.env.SELLER_EMAIL
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

  if (resendApiKey && sellerEmail) {
    const resend = new Resend(resendApiKey)
    resend.emails.send({
      from: fromEmail,
      to: sellerEmail,
      subject: `New Order ${reference} — centimentalcomics`,
      react: OrderNotificationEmail({
        reference,
        customerName: validation.data.name,
        customerEmail: validation.data.email,
        customerPhone: validation.data.phone || null,
        notes: validation.data.notes || null,
        items: orderItems,
        total,
      }),
    }).catch((err: unknown) => {
      // Email failure must NOT fail the order — log and continue
      console.error('Resend email failed (order still saved):', err)
    })
  } else {
    console.warn('RESEND_API_KEY or SELLER_EMAIL not set — skipping seller notification')
  }

  // 9. Redirect to confirmation page (prevents back-button resubmission)
  redirect(`/checkout/success?orderId=${insertedOrder.id}`)
}
