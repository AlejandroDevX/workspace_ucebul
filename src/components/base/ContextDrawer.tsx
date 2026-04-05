import { type PropsWithChildren, type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/base/Button'

interface ContextDrawerProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  footer?: ReactNode
}

export function ContextDrawer({
  isOpen,
  onClose,
  title,
  description,
  footer,
  children,
}: ContextDrawerProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="drawer__header">
          <div>
            <h2 id="drawer-title" className="drawer__title">
              {title}
            </h2>
            {description ? <p className="drawer__description">{description}</p> : null}
          </div>
          <Button
            variant="ghost"
            aria-label="Cerrar panel"
            className="drawer__close"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </header>
        <div className="drawer__content">{children}</div>
        {footer ? <footer className="drawer__footer">{footer}</footer> : null}
      </aside>
    </div>,
    document.body,
  )
}
