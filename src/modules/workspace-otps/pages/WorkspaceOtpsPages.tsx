import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/base/Button'
import { ConfirmDialog } from '@/components/base/ConfirmDialog'
import { ResourceTable } from '@/components/base/ResourceTable'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { StatusBadge } from '@/components/feedback/StatusBadge'
import { CrudPageLayout } from '@/components/layout/CrudPageLayout'
import { SectionCard } from '@/components/layout/SectionCard'
import {
  useDeleteWorkspaceOtpMutation,
  useWorkspaceOtpQuery,
  useWorkspaceOtpsQuery,
} from '@/modules/workspace-otps/hooks/useWorkspaceOtpsQuery'
import type { WorkspaceOtp } from '@/modules/workspace-otps/types/workspace-otp.types'
import { APP_ROUTES, detailRoutes } from '@/routes/paths'
import { getErrorMessage } from '@/utils/error-message'

function resolveOtpTone(otp: WorkspaceOtp) {
  if (otp.workspace_otp_used_at) {
    return 'warning'
  }

  return 'success'
}

function resolveOtpLabel(otp: WorkspaceOtp) {
  return otp.workspace_otp_used_at ? 'Usado' : 'Disponible'
}

export function WorkspaceOtpsPage() {
  const query = useWorkspaceOtpsQuery()
  const deleteMutation = useDeleteWorkspaceOtpMutation()
  const [itemToDelete, setItemToDelete] = useState<WorkspaceOtp | null>(null)

  async function handleDelete() {
    if (!itemToDelete) {
      return
    }

    await deleteMutation.mutateAsync(itemToDelete.workspace_otp_id)
    setItemToDelete(null)
  }

  if (query.isLoading) {
    return <LoadingState fullScreen message="Cargando OTPs..." />
  }

  if (query.error) {
    return <ErrorState description={getErrorMessage(query.error)} />
  }

  return (
    <CrudPageLayout
      eyebrow="Super Admin"
      title="OTPs"
      description="Consulta administrativa mínima de códigos OTP generados por el workspace."
    >
      <SectionCard title="Listado" description="Solo lectura general y eliminación por super admin.">
        <ResourceTable
          caption="Workspace otps"
          columns={[
            {
              key: 'email',
              header: 'Correo',
              cell: (row) => row.workspace_otp_email,
            },
            {
              key: 'purpose',
              header: 'Propósito',
              cell: (row) => row.workspace_otp_purpose,
            },
            {
              key: 'status',
              header: 'Estado',
              cell: (row) => (
                <StatusBadge label={resolveOtpLabel(row)} tone={resolveOtpTone(row)} />
              ),
            },
            {
              key: 'actions',
              header: 'Acciones',
              cell: (row) => (
                <div className="resource-table__actions">
                  <Link className="button button--ghost" to={detailRoutes.otp(row.workspace_otp_id)}>
                    Abrir
                  </Link>
                  <Button
                    variant="danger"
                    leftIcon={<Trash2 size={16} />}
                    onClick={() => setItemToDelete(row)}
                  >
                    Eliminar
                  </Button>
                </div>
              ),
            },
          ]}
          data={query.data ?? []}
          getRowId={(row) => row.workspace_otp_id}
          emptyTitle="Sin OTPs"
          emptyDescription="No hay OTPs disponibles para mostrar."
        />
      </SectionCard>

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Eliminar OTP"
        description="Se eliminará el OTP seleccionado."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}

export function WorkspaceOtpDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const workspaceOtpId = params.workspaceOtpId ?? ''
  const query = useWorkspaceOtpQuery(workspaceOtpId)
  const deleteMutation = useDeleteWorkspaceOtpMutation()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  async function handleDelete() {
    await deleteMutation.mutateAsync(workspaceOtpId)
    navigate(APP_ROUTES.otps, { replace: true })
  }

  if (query.isLoading) {
    return <LoadingState fullScreen message="Cargando OTP..." />
  }

  if (query.error) {
    return <ErrorState description={getErrorMessage(query.error)} />
  }

  if (!query.data) {
    return <ErrorState description="No fue posible resolver el OTP solicitado." />
  }

  const otp = query.data

  return (
    <CrudPageLayout
      eyebrow="Super Admin"
      title="Detalle de OTP"
      description="Vista de solo lectura del recurso `workspace-otps`."
    >
      <SectionCard
        title={`OTP #${workspaceOtpId}`}
        description="El backend solo expone lectura y eliminación para este recurso."
        action={
          <Button
            variant="danger"
            leftIcon={<Trash2 size={16} />}
            onClick={() => setIsDeleteOpen(true)}
          >
            Eliminar OTP
          </Button>
        }
      >
        <dl className="detail-list">
          <div>
            <dt>Correo</dt>
            <dd>{otp.workspace_otp_email}</dd>
          </div>
          <div>
            <dt>Código</dt>
            <dd>{otp.workspace_otp_code}</dd>
          </div>
          <div>
            <dt>Propósito</dt>
            <dd>{otp.workspace_otp_purpose}</dd>
          </div>
          <div>
            <dt>Expira en</dt>
            <dd>{otp.workspace_otp_expires_at}</dd>
          </div>
          <div>
            <dt>Usado en</dt>
            <dd>{otp.workspace_otp_used_at ?? 'No usado'}</dd>
          </div>
        </dl>
      </SectionCard>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Eliminar OTP"
        description="Esta acción eliminará el OTP seleccionado."
        confirmLabel="Eliminar"
        isConfirming={deleteMutation.isPending}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </CrudPageLayout>
  )
}
