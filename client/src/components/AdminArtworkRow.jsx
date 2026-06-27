import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function AdminArtworkRow({
  artwork,
  onEdit,
  onDelete,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: artwork.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`admin-row${isDragging ? ' admin-row-dragging' : ''}`}
    >
      <div className="admin-row-order">
        <button
          type="button"
          className="admin-handle-button"
          aria-label={`Drag to reorder ${artwork.title}`}
          {...attributes}
          {...listeners}
        >
          <span className="admin-handle" aria-hidden="true">
            ::
          </span>
        </button>
      </div>

      <img className="admin-thumb" src={artwork.image} alt={artwork.alt} />

      <div className="admin-row-main">
        <h2>{artwork.title}</h2>
        <p>{artwork.price}</p>
      </div>

      <p className={`admin-status admin-status-${artwork.status.toLowerCase()}`}>
        {artwork.status}
      </p>

      <div className="admin-row-actions">
        <button type="button" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="admin-delete-button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  )
}

export default AdminArtworkRow
