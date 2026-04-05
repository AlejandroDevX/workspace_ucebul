import type { PropsWithChildren, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/base/Button'

interface ModalProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  footer?: ReactNode
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  footer,
  children,
}: ModalProps) {
  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <div>
            <h2 id="modal-title" className="modal__title">
              {title}
            </h2>
            {description ? <p className="modal__description">{description}</p> : null}
          </div>
          <Button
            variant="ghost"
            aria-label="Cerrar modal"
            className="modal__close"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </header>
        <div className="modal__content">{children}</div>
        {footer ? <footer className="modal__footer">{footer}</footer> : null}
      </div>
    </div>,
    document.body,
  )
}
