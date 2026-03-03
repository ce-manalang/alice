import ProductCard from './ProductCard'
import type { Product } from '@/app/lib/types'

interface ProductGridProps {
  products: Product[]
  emptyMessage?: string
}

export default function ProductGrid({
  products,
  emptyMessage = 'No products found.',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="shop-empty-state">
        <p className="shop-empty-state__heading">Products coming soon</p>
        <p className="shop-empty-state__body">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="products-grid">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 3} />
      ))}
    </div>
  )
}
