import { useEffect, useState } from 'react'
import ArtworkCard from './ArtworkCard'

function GalleryGrid({ artworks, onOpen, onEnquire }) {
  const [columnCount, setColumnCount] = useState(() => getColumnCount(window.innerWidth))

  useEffect(() => {
    function handleResize() {
      setColumnCount(getColumnCount(window.innerWidth))
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const columns = Array.from({ length: columnCount }, () => [])

  artworks.forEach((artwork, index) => {
    columns[index % columnCount].push(artwork)
  })

  return (
    <section className="gallery-grid" aria-label="Artwork collection">
      {columns.map((column, columnIndex) => (
        <div key={`gallery-column-${columnIndex}`} className="gallery-column">
          {column.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onOpen={onOpen}
              onEnquire={onEnquire}
            />
          ))}
        </div>
      ))}
    </section>
  )
}

function getColumnCount(width) {
  if (width >= 1040) {
    return 3
  }

  if (width >= 680) {
    return 2
  }

  return 1
}

export default GalleryGrid
