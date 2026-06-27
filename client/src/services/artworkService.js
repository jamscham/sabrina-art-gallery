import { artworks as sampleArtworks } from '../data/artworks'
import { loadArtworks, saveArtworks } from '../utils/storage'

function cloneArtworks(artworks) {
  return artworks.map((artwork) => ({ ...artwork }))
}

export function getArtworks() {
  return loadArtworks(sampleArtworks)
}

export function createArtwork(newArtwork) {
  const artworks = getArtworks()
  const nextArtworks = [
    ...artworks,
    {
      id: crypto.randomUUID(),
      ...newArtwork,
    },
  ]

  saveArtworks(nextArtworks)
  return nextArtworks
}

export function updateArtwork(id, changes) {
  const artworks = getArtworks()
  const nextArtworks = artworks.map((artwork) =>
    artwork.id === id ? { ...artwork, ...changes } : artwork,
  )

  saveArtworks(nextArtworks)
  return nextArtworks
}

export function deleteArtwork(id) {
  const artworks = getArtworks()
  const nextArtworks = artworks.filter((artwork) => artwork.id !== id)

  saveArtworks(nextArtworks)
  return nextArtworks
}

export function reorderArtworks(updatedOrder) {
  const nextArtworks = cloneArtworks(updatedOrder)
  saveArtworks(nextArtworks)
  return nextArtworks
}

export function resetArtworks() {
  const nextArtworks = cloneArtworks(sampleArtworks)
  saveArtworks(nextArtworks)
  return nextArtworks
}
