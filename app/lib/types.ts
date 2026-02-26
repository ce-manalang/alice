export type ProductCategory = 'zines' | 'apparel' | 'stationery' | 'pins'

export type ProductAvailability = 'available' | 'pre-order' | 'sold-out'

export interface ProductImage {
  url: string
  alt: string
}

export interface Product {
  id: string
  name: string
  price: string
  images: ProductImage[]
  alt: string
  description?: string
  available: boolean
  category?: ProductCategory
}
