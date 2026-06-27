import { useState } from 'react'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import AdminArtworkRow from '../components/AdminArtworkRow'
import ArtworkFormModal from '../components/ArtworkFormModal'
import {
  createArtwork,
  deleteArtwork,
  reorderArtworks,
  resetArtworks,
  updateArtwork,
} from '../services/artworkService'

function AdminPage({ artworks, setArtworks, navigate, showToast }) {
  const [editingArtwork, setEditingArtwork] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function openAddModal() {
    setEditingArtwork(null)
    setIsModalOpen(true)
  }

  function openEditModal(artwork) {
    setEditingArtwork(artwork)
    setIsModalOpen(true)
  }

  function closeModal() {
    setEditingArtwork(null)
    setIsModalOpen(false)
  }

  function handleDragEnd(event) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = artworks.findIndex((artwork) => artwork.id === active.id)
    const newIndex = artworks.findIndex((artwork) => artwork.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const nextArtworks = arrayMove(artworks, oldIndex, newIndex)
    setArtworks(reorderArtworks(nextArtworks))
    showToast('Gallery order updated')
  }

  function handleDelete(id) {
    const artwork = artworks.find((item) => item.id === id)

    if (!artwork) {
      return
    }

    const confirmed = window.confirm(`Delete "${artwork.title}" from the gallery?`)

    if (!confirmed) {
      return
    }

    setArtworks(deleteArtwork(id))
    showToast('Artwork deleted')
  }

  function handleSave(artworkInput) {
    if (editingArtwork) {
      setArtworks(updateArtwork(editingArtwork.id, artworkInput))
      showToast('Artwork updated')
    } else {
      setArtworks(createArtwork(artworkInput))
      showToast('Artwork added')
    }

    closeModal()
  }

  function handleResetSampleData() {
    const confirmed = window.confirm(
      'Reset all artworks to the original sample data?',
    )

    if (!confirmed) {
      return
    }

    setArtworks(resetArtworks())
    showToast('Sample data reset')
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-kicker">Gallery Admin</p>
          <h1>Gallery Admin</h1>
          <p className="admin-subtitle">Manage artworks, order, and availability.</p>
        </div>

        <div className="admin-actions">
          <button
            type="button"
            className="admin-link-button"
            onClick={() => navigate('/')}
          >
            View Gallery
          </button>
          <button type="button" className="admin-primary-button" onClick={openAddModal}>
            Add Artwork
          </button>
        </div>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={artworks.map((artwork) => artwork.id)}
          strategy={verticalListSortingStrategy}
        >
          <section className="admin-list" aria-label="Artwork management list">
            {artworks.map((artwork, index) => (
              <AdminArtworkRow
                key={artwork.id}
                artwork={artwork}
                onEdit={() => openEditModal(artwork)}
                onDelete={() => handleDelete(artwork.id)}
              />
            ))}
          </section>
        </SortableContext>
      </DndContext>

      <ArtworkFormModal
        artwork={editingArtwork}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
      />

      <div className="admin-reset-row">
        <button
          type="button"
          className="admin-secondary-button"
          onClick={handleResetSampleData}
        >
          Reset Sample Data
        </button>
      </div>
    </main>
  )
}

export default AdminPage
