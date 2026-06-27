import { useEffect, useRef, useState } from 'react'
import { sendEnquiry } from '../services/enquiryService'

const emptyForm = {
  fullName: '',
  email: '',
  phoneNumber: '',
  address: '',
  country: '',
  message: '',
}

function EnquiryModal({ artwork, isOpen, onClose, onSuccess }) {
  const [formValues, setFormValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const panelRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      setFormValues(emptyForm)
      setErrors({})
      return
    }

    const firstInput = panelRef.current?.querySelector('input, textarea, button')
    firstInput?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return
      }

      const focusableElements = panelRef.current.querySelectorAll(
        'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])',
      )

      if (!focusableElements.length) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !artwork) {
    return null
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
  }

  function validateForm() {
    const nextErrors = {}

    if (!formValues.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    }

    if (!formValues.email.trim()) {
      nextErrors.email = 'Email address is required.'
    }

    return nextErrors
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validateForm()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    sendEnquiry({
      artworkId: artwork.id,
      artworkTitle: artwork.title,
      fullName: formValues.fullName.trim(),
      email: formValues.email.trim(),
      phoneNumber: formValues.phoneNumber.trim(),
      address: formValues.address.trim(),
      country: formValues.country.trim(),
      message: formValues.message.trim(),
      timestamp: new Date().toISOString(),
    })

    setFormValues(emptyForm)
    setErrors({})
    onSuccess()
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className="modal-panel enquiry-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose}>
          Close
        </button>

        <div className="enquiry-header">
          <h2 id="enquiry-modal-title">Enquire About Artwork</h2>
        </div>

        <div className="enquiry-artwork">
          <img className="enquiry-thumb" src={artwork.image} alt={artwork.alt} />
          <div className="enquiry-artwork-copy">
            <p className="enquiry-label">Selected artwork</p>
            <h3>{artwork.title}</h3>
            <p className="modal-price">{artwork.price}</p>
          </div>
        </div>

        <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
          <label>
            Full Name *
            <input
              name="fullName"
              value={formValues.fullName}
              onChange={handleChange}
            />
            {errors.fullName ? <span className="field-error">{errors.fullName}</span> : null}
          </label>

          <label>
            Email Address *
            <input
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
            />
            {errors.email ? <span className="field-error">{errors.email}</span> : null}
          </label>

          <label>
            Phone Number
            <input
              name="phoneNumber"
              value={formValues.phoneNumber}
              onChange={handleChange}
            />
          </label>

          <label>
            Address
            <input
              name="address"
              value={formValues.address}
              onChange={handleChange}
            />
          </label>

          <label>
            Country
            <input
              name="country"
              value={formValues.country}
              onChange={handleChange}
            />
          </label>

          <label>
            Message
            <textarea
              name="message"
              rows="5"
              value={formValues.message}
              onChange={handleChange}
            />
          </label>

          <div className="enquiry-actions">
            <button type="button" className="enquiry-secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="enquire-button">
              Send Enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EnquiryModal
