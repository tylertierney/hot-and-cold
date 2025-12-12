import type { FC, MouseEvent, PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const Modal: FC<PropsWithChildren<Props>> = ({ isOpen, onClose, children }) => {
  const backdropRef = useRef<HTMLDivElement>(null)

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Close when clicking outside
  const onBackdropClick = (e: MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      ref={backdropRef}
      onClick={onBackdropClick}
      aria-modal='true'
      role='dialog'
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: 'color-mix(in hsl, var(--bg-color) 85%, transparent)',
          backdropFilter: 'blur(14px)',
          padding: '1.5rem',
          borderRadius: '10px',
          minWidth: '300px',
          maxWidth: '90%',
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal
