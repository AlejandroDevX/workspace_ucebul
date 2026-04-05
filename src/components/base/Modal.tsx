import { Modal as FoundationModal } from 'foundation-ui'
import type { PropsWithChildren, ReactNode } from 'react'

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
  return (
    <FoundationModal
      description={description}
      footer={footer}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
      open={isOpen}
      title={title}
    >
      {children}
    </FoundationModal>
  )
}
