import { useEffect, useRef, useState } from 'react'
import { readImageFileAsDataUrl } from '../utils/image'

const emptyArtwork = {
  title: '',
  description: '',
  price: '',
  image: '',
  status: 'Available',
}

function ArtworkFormModal({ artwork, isOpen, onClose, onSave }) {
  const [formValues, setFormValues] = useState(emptyArtwork)
  const [imageError, setImageError] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setFormValues(
      artwork
        ? {
            title: artwork.title,
            description: artwork.description,
            price: artwork.price,
            image: artwork.image,
            status: artwork.status,
          }
        : emptyArtwork,
    )
    setImageError('')
    setSelectedFileName('')
  }, [artwork, isOpen])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (!isOpen) {
      return undefined
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  async function handleImageSelect(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setImageError('')
    setSelectedFileName(file.name)

    try {
      const imageDataUrl = await readImageFileAsDataUrl(file)
      setFormValues((currentValues) => ({
        ...currentValues,
        image: imageDataUrl,
      }))
    } catch {
      setImageError('Image upload failed. Please try another file.')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!formValues.image) {
      setImageError('Please choose an image before saving.')
      return
    }

    onSave({
      ...formValues,
      alt: formValues.title
        ? `${formValues.title} artwork preview`
        : 'Artwork preview',
    })
  }

  return (
    <div className="admin-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="admin-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h2 id="artwork-form-title">{artwork ? 'Edit Artwork' : 'Add Artwork'}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              name="title"
              value={formValues.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formValues.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </label>

          <label>
            Price
            <input
              name="price"
              value={formValues.price}
              onChange={handleChange}
              placeholder="£950"
              required
            />
          </label>

          <div className="admin-image-field">
            <span>Image</span>
            <input
              ref={fileInputRef}
              className="admin-file-input"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
            />
            <div className="admin-image-controls">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Image
              </button>
              <p className="admin-file-name">
                {selectedFileName ||
                  (formValues.image ? 'Current image selected' : 'No file chosen')}
              </p>
            </div>
            {imageError ? <p className="admin-field-error">{imageError}</p> : null}
          </div>

          <fieldset className="admin-status-fieldset">
            <legend>Status</legend>
            <div className="admin-status-options">
              {['Available', 'Reserved', 'Sold'].map((statusOption) => (
                <label key={statusOption} className="admin-radio-option">
                  <input
                    type="radio"
                    name="status"
                    value={statusOption}
                    checked={formValues.status === statusOption}
                    onChange={handleChange}
                  />
                  {statusOption}
                </label>
              ))}
            </div>
          </fieldset>

          {formValues.image ? (
            <div className="admin-image-preview">
              <img src={formValues.image} alt="Artwork preview" />
            </div>
          ) : null}

          <div className="admin-form-actions">
            <button type="button" className="admin-secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-primary-button">
              Save Artwork
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ArtworkFormModal
