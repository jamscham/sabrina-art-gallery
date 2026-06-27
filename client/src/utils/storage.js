const ARTWORKS_STORAGE_KEY = 'sabrina-art-gallery-artworks'

function cloneArtworks(artworks) {
  return artworks.map((artwork) => ({ ...artwork }))
}

export function loadArtworks(fallbackArtworks) {
  const fallbackCopy = cloneArtworks(fallbackArtworks)

  try {
    const storedArtworks = window.localStorage.getItem(ARTWORKS_STORAGE_KEY)

    if (!storedArtworks) {
      window.localStorage.setItem(
        ARTWORKS_STORAGE_KEY,
        JSON.stringify(fallbackCopy),
      )
      return fallbackCopy
    }

    const parsedArtworks = JSON.parse(storedArtworks)

    if (!Array.isArray(parsedArtworks)) {
      window.localStorage.setItem(
        ARTWORKS_STORAGE_KEY,
        JSON.stringify(fallbackCopy),
      )
      return fallbackCopy
    }

    return parsedArtworks
  } catch {
    window.localStorage.setItem(
      ARTWORKS_STORAGE_KEY,
      JSON.stringify(fallbackCopy),
    )
    return fallbackCopy
  }
}

export function saveArtworks(artworks) {
  window.localStorage.setItem(
    ARTWORKS_STORAGE_KEY,
    JSON.stringify(artworks),
  )
}
