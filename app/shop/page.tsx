import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { datocmsRequest } from "@/app/lib/datocms"

export const metadata: Metadata = {
  title: "centimentalcomics: shop",
  description: "shop centimentalcomics merchandise and products",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "centimentalcomics: shop",
    description: "shop centimentalcomics merchandise and products",
    url: "/shop",
  },
}

// GraphQL query for products
const PRODUCTS_QUERY = `
  query {
    allProducts {
      alt(markdown: false)
      id
      images {
        url
      }
      name
      price
    }
  }
`

// Type for the product data
interface Product {
  id: string;
  name: string;
  price: string;
  images: {
    url: string;
  }[];
  alt: string;
}

export default async function Shop() {
	// Fetch products from DatoCMS
	const data = await datocmsRequest<{ allProducts: Product[] }>(PRODUCTS_QUERY);
	const products = data.allProducts || [];

	return (
		<div className="container">
			<header className="header">
				<h1 className="title"><Link href="/">centimentalcomics</Link></h1>
				<h2>some comics about art and internet</h2>
				<div className="value-props row">
				</div>
			</header>
			<div className="navbar-spacer"></div>
			<nav className="navbar">
				<div className="container">
					<ul className="navbar-list">
						<li className="navbar-item">
							<a className="navbar-link" href="/">home</a>
						</li>
						<li className="navbar-item">
							<a className="navbar-link" href="/shop">shop</a>
						</li>
						<li className="navbar-item">
							<a className="navbar-link" href="about">about</a>
						</li>
					</ul>
				</div>
			</nav>
			
			<div className="docs-section">
				<div className="shop-header">
					<h2 className="shop-title">Products</h2>
					<div className="sort-container">
						<label htmlFor="sort-select">Sort by</label>
						<select id="sort-select" className="sort-select">
							<option value="alphabetical">Alphabetically, A-Z</option>
							<option value="price-low">Price: Low to High</option>
							<option value="price-high">Price: High to Low</option>
							<option value="newest">Newest First</option>
						</select>
					</div>
				</div>
				
				<div className="products-grid">
					{products.map((product) => (
						<Link key={product.id} href={`/shop/${product.id}`} className="product-card-link">
							<div className="product-card">
								<div className="product-image">
									<Image
										src={product.images[0]?.url || '/assets/images/placeholder.jpg'}
										alt={product.alt}
										width={300}
										height={300}
										style={{ width: '100%', height: 'auto' }}
									/>
								</div>
								<div className="product-info">
									<h3 className="product-name">{product.name}</h3>
									<p className="product-price">{product.price}</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}
