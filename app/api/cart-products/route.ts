import { NextRequest, NextResponse } from 'next/server'
import { datocmsRequest } from '@/app/lib/datocms'
import type { Product } from '@/app/lib/types'

const CART_PRODUCTS_QUERY = `
  query CartProducts($ids: [ItemId]!) {
    allProducts(filter: { id: { in: $ids } }) {
      id
      name
      price
      slug
      images { url alt }
    }
  }
`

export async function POST(request: NextRequest) {
  const { ids } = await request.json()

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ allProducts: [] })
  }

  const data = await datocmsRequest<{ allProducts: Product[] }>(CART_PRODUCTS_QUERY, { ids })
  return NextResponse.json(data)
}
