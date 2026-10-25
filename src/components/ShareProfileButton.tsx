import { useState } from 'react'
import { Check, Copy, Facebook, Instagram, MessageCircle, Share2 } from 'lucide-react'

type ShareProfileButtonProps = {
  name: string
  description: string
  isDraft?: boolean
}

export function ShareProfileButton({ name, description, isDraft = false }: ShareProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState('')
  const url = window.location.href
  const shareText = `${name} — ${description} ${url}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(`${name} — ${description}`)}`

  async function copyProfileLink() {
    try {
      await navigator.clipboard.writeText(url)
      setStatus('Lien du profil copié.')
    } catch {
      setStatus('Copie automatique indisponible. Sélectionnez le lien ci-dessous.')
    }
  }

  return (
    <div className="share-profile">
      <button
        className="button button--outline share-profile__button"
        type="button"
        onClick={() => {
          setIsOpen((open) => !open)
          setStatus('')
        }}
        aria-expanded={isOpen}
        aria-controls="share-profile-options"
      >
        <Share2 size={16} /> Partager le profil
      </button>
      {isOpen && (
        <div className="share-profile__menu" id="share-profile-options" aria-label="Options de partage">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => setStatus('WhatsApp va s’ouvrir dans un nouvel onglet.')}>
            <MessageCircle size={17} /> WhatsApp
          </a>
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" onClick={() => setStatus('Facebook va s’ouvrir dans un nouvel onglet.')}>
            <Facebook size={17} /> Facebook
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              void copyProfileLink()
              setStatus('Lien copié : collez-le dans votre publication ou message Instagram.')
            }}
          >
            <Instagram size={17} /> Instagram <span className="share-profile__hint">copier le lien et ouvrir</span>
          </a>
          <button type="button" onClick={copyProfileLink}>
            {status === 'Lien du profil copié.' ? <Check size={17} /> : <Copy size={17} />}
            Copier le lien
          </button>
          <label className="share-profile__fallback">
            <span className="sr-only">Lien du profil</span>
            <input readOnly value={url} onFocus={(event) => event.currentTarget.select()} />
          </label>
        </div>
      )}
      {status && <p className="share-profile__status" role="status">{status}</p>}
      {isDraft && <p className="share-profile__notice">Cette fiche de démonstration est publique, mais ne représente pas un professionnel réel.</p>}
    </div>
  )
}
