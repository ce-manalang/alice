export type ProductCategory = 'zines' | 'apparel' | 'stationery' | 'pins'

export type ProductAvailability = 'available' | 'pre-order' | 'sold-out'

export interface ProductImage {
  url: string
  alt: string | null
}

export interface Product {
  id: string
  name: string
  // DatoCMS stores price as a Float; format for display in components
  price: number
  images: ProductImage[]
  alt: string | null
  description?: string | null
  slug?: string | null
  // Fields to be added to DatoCMS schema in future:
  available?: boolean
  category?: ProductCategory
}

// Cart types
export interface CartItem {
  productId: string
  quantity: number
}

// Order types (Phase 3 — Checkout)
export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number  // Unit price in PHP (numeric)
}

export interface OrderInsert {
  reference: string
  customer_name: string
  customer_email: string
  customer_phone?: string | null
  notes?: string | null
  items: OrderItem[]
  total: number
  status: 'pending'
}

// Return type from submitOrder Server Action
export type SubmitOrderResult =
  | { error: string; formData?: Record<string, unknown> }
  | { success: true; orderId: string }
