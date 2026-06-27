function ToastContainer({ toast }) {
  if (!toast) {
    return null
  }

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      <div className={`toast toast-${toast.type ?? 'success'}`}>{toast.message}</div>
    </div>
  )
}

export default ToastContainer
