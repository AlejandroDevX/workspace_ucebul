import { ConfirmDialog as FoundationConfirmDialog } from 'foundation-ui'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  isConfirming?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isConfirming = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <FoundationConfirmDialog
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel}
      confirmLoading={isConfirming}
      description={description}
      onCancel={onCancel}
      onConfirm={onConfirm}
      onOpenChange={(open) => {
        if (!open) {
          onCancel()
        }
      }}
      open={isOpen}
      title={title}
      tone="danger"
    >
      <p className="text-muted">Esta acción no se puede deshacer desde la interfaz actual.</p>
    </FoundationConfirmDialog>
  )
}
