// GraphQL queries for DatoCMS
// Note: 'available', 'category', and 'featured' fields are not yet in the DatoCMS schema.
// They need to be added via the DatoCMS dashboard before those query filters will work.

export const PRODUCTS_QUERY = `
  query AllProducts {
    allProducts(orderBy: _createdAt_DESC) {
      id
      name
      price
      slug
      alt(markdown: false)
      images {
        url
        alt
      }
      description(markdown: false)
    }
  }
` as const

// Category filtering requires a 'category' field on ProductRecord.
// Once added to DatoCMS, replace this query with a filtered version.
// For now, this query fetches all products (category pages will show all products).
export const PRODUCTS_BY_CATEGORY_QUERY = `
  query AllProducts {
    allProducts(orderBy: _createdAt_DESC) {
      id
      name
      price
      slug
      alt(markdown: false)
      images {
        url
        alt
      }
      description(markdown: false)
    }
  }
` as const

export const ALL_PRODUCT_IDS_QUERY = `
  query AllProductIds {
    allProducts {
      id
      slug
    }
  }
` as const

export const SINGLE_PRODUCT_QUERY = `
  query SingleProduct($id: ItemId!) {
    product(filter: { id: { eq: $id } }) {
      id
      name
      price
      slug
      alt(markdown: false)
      images {
        url
        alt
      }
      description(markdown: true)
    }
  }
` as const

// Featured products query — requires 'featured' boolean field on ProductRecord.
// Until that field is added to DatoCMS, this returns the most recent products instead.
export const FEATURED_PRODUCTS_QUERY = `
  query FeaturedProducts($first: IntType!) {
    allProducts(first: $first, orderBy: _createdAt_DESC) {
      id
      name
      price
      slug
      alt(markdown: false)
      images {
        url
        alt
      }
    }
  }
` as const

// Keep comics query for existing comic pages
export const ALL_COMICS_QUERY = `
  query AllComics {
    allComics(first: 100) {
      id
      title
      image {
        alt
        url
      }
      nextComic {
        slug
      }
      prevComic {
        slug
      }
      slug
      blurb(markdown: true)
      body(markdown: true)
      date
    }
    _allComicsMeta { count }
  }
` as const
