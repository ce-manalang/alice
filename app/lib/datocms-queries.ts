// GraphQL queries for DatoCMS

export const PRODUCTS_QUERY = `
  query AllProducts {
    allProducts(orderBy: _createdAt_DESC) {
      id
      name
      price
      alt(markdown: false)
      images {
        url
        alt
      }
      available
      category
    }
  }
` as const

export const PRODUCTS_BY_CATEGORY_QUERY = `
  query ProductsByCategory($category: String!) {
    allProducts(filter: { category: { eq: $category } }, orderBy: _createdAt_DESC) {
      id
      name
      price
      alt(markdown: false)
      images {
        url
        alt
      }
      available
      category
    }
  }
` as const

export const ALL_PRODUCT_IDS_QUERY = `
  query AllProductIds {
    allProducts {
      id
    }
  }
` as const

export const SINGLE_PRODUCT_QUERY = `
  query SingleProduct($id: ItemId!) {
    product(filter: { id: { eq: $id } }) {
      id
      name
      price
      alt(markdown: false)
      images {
        url
        alt
      }
      description(markdown: true)
      available
      category
    }
  }
` as const

export const FEATURED_PRODUCTS_QUERY = `
  query FeaturedProducts($first: IntType!) {
    allProducts(first: $first, filter: { featured: { eq: true } }, orderBy: _createdAt_DESC) {
      id
      name
      price
      alt(markdown: false)
      images {
        url
        alt
      }
      available
      category
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
