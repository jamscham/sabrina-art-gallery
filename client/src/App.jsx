import { useEffect, useState } from 'react'
import './App.css'
import ToastContainer from './components/ToastContainer'
import AdminPage from './pages/AdminPage'
import GalleryPage from './pages/GalleryPage'
import { getArtworks } from './services/artworkService'

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [artworks, setArtworks] = useState(() => getArtworks())
  const [toast, setToast] = useState(null)

  useEffect(() => {
    function handlePopState() {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null)
    }, 2500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [toast])

  function navigate(nextPath) {
    if (nextPath === pathname) {
      return
    }

    window.history.pushState({}, '', nextPath)
    setPathname(nextPath)
  }

  function showToast(message, type = 'success') {
    setToast({
      id: crypto.randomUUID(),
      message,
      type,
    })
  }

  if (pathname === '/admin') {
    return (
      <>
        <AdminPage
          artworks={artworks}
          setArtworks={setArtworks}
          navigate={navigate}
          showToast={showToast}
        />
        <ToastContainer toast={toast} />
      </>
    )
  }

  return (
    <>
      <GalleryPage artworks={artworks} showToast={showToast} />
      <ToastContainer toast={toast} />
    </>
  )
}

export default App
