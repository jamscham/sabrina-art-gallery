function ArtworkCard({ artwork, onOpen, onEnquire }) {
  const isUnavailable = artwork.status !== 'Available'

  return (
    <article className="artwork-card">
      <button
        type="button"
        className="artwork-image-button"
        onClick={() => onOpen(artwork)}
        aria-label={`View larger image of ${artwork.title}`}
      >
        <img className="artwork-image" src={artwork.image} alt={artwork.alt} />
      </button>

      <div className="artwork-copy">
        <div className="artwork-meta">
          <span className={`status-badge status-${artwork.status.toLowerCase()}`}>
            {artwork.status}
          </span>
          <p className="artwork-price">{artwork.price}</p>
        </div>

        <div className="artwork-text">
          <h2>{artwork.title}</h2>
          <p>{artwork.description}</p>
        </div>

        <button
          type="button"
          className="enquire-button"
          disabled={isUnavailable}
          onClick={() => onEnquire(artwork)}
        >
          Enquire
        </button>
      </div>
    </article>
  )
}

export default ArtworkCard
