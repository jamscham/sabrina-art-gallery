function ArtworkModal({ artwork, onClose, onEnquire }) {
  if (!artwork) {
    return null
  }

  const isAvailable = artwork.status === 'Available'

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose}>
          Close
        </button>

        <div className="modal-layout">
          <img className="modal-image" src={artwork.image} alt={artwork.alt} />

          <div className="modal-copy">
            <span className={`status-badge status-${artwork.status.toLowerCase()}`}>
              {artwork.status}
            </span>
            <h2 id="artwork-modal-title">{artwork.title}</h2>
            <p className="modal-description">{artwork.description}</p>
            <p className="modal-price">{artwork.price}</p>
            {isAvailable ? (
              <button
                type="button"
                className="enquire-button"
                onClick={() => onEnquire(artwork)}
              >
                Enquire
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtworkModal
