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
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 0',
          color: '#9ca3af',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <p>{emptyMessage}</p>
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
