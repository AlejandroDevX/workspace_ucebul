import { Drawer } from 'foundation-ui'
import { type PropsWithChildren, type ReactNode } from 'react'

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
  return (
    <Drawer
      description={description}
      footer={footer}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
      open={isOpen}
      placement="right"
      title={title}
    >
      {children}
    </Drawer>
  )
}
