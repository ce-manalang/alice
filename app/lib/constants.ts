import type { ProductCategory } from './types'

export const CATEGORIES: ProductCategory[] = ['zines', 'apparel', 'stationery', 'pins']

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  zines: 'Zines',
  apparel: 'Apparel',
  stationery: 'Stationery',
  pins: 'Pins',
}

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/centimentalcomics',
  twitter: 'https://twitter.com/centimentalcomx',
} as const

export const FEATURED_PRODUCT_COUNT = 4

export const SITE_URL = 'https://centimentalcomics.com'

export const PRODUCTS_CACHE_TAG = 'products'
