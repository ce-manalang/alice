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
