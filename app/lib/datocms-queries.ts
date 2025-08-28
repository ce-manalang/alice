// GraphQL queries for DatoCMS

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
    }
  }
` as const


