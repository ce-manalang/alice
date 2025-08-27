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


