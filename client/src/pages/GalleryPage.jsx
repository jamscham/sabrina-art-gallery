import { useEffect, useState } from 'react'
import EnquiryModal from '../components/EnquiryModal'
import ArtworkModal from '../components/ArtworkModal'
import GalleryGrid from '../components/GalleryGrid'

function GalleryPage({ artworks, showToast }) {
  const [selectedArtworkId, setSelectedArtworkId] = useState(null)
  const [enquiryArtworkId, setEnquiryArtworkId] = useState(null)

  const selectedArtwork =
    artworks.find((artwork) => artwork.id === selectedArtworkId) ?? null
  const enquiryArtwork =
    artworks.find((artwork) => artwork.id === enquiryArtworkId) ?? null

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setSelectedArtworkId(null)
        setEnquiryArtworkId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = selectedArtwork || enquiryArtwork ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [enquiryArtwork, selectedArtwork])

  function handleEnquiryOpen(artwork) {
    if (artwork.status !== 'Available') {
      return
    }

    setEnquiryArtworkId(artwork.id)
  }

  function handleModalEnquiryOpen(artwork) {
    if (artwork.status !== 'Available') {
      return
    }

    setSelectedArtworkId(null)
    setEnquiryArtworkId(artwork.id)
  }

  function handleEnquirySuccess() {
    setEnquiryArtworkId(null)
    showToast('Enquiry sent successfully.')
  }

  return (
    <main className="gallery-page">
      <header className="gallery-header">
        <h1>Art By Sabrina</h1>
        <p className="gallery-subtitle">Original Artwork</p>
      </header>

      <GalleryGrid
        artworks={artworks}
        onOpen={(artwork) => setSelectedArtworkId(artwork.id)}
        onEnquire={handleEnquiryOpen}
      />

      <footer className="gallery-footer">
        <p>Created by Cunningham Software</p>
        <p>Copyright {new Date().getFullYear()}</p>
      </footer>

      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtworkId(null)}
        onEnquire={handleModalEnquiryOpen}
      />
      <EnquiryModal
        artwork={enquiryArtwork}
        isOpen={Boolean(enquiryArtwork)}
        onClose={() => setEnquiryArtworkId(null)}
        onSuccess={handleEnquirySuccess}
      />
    </main>
  )
}

export default GalleryPage
