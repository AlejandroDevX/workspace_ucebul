import { Save } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/base/Button'
import { ContextDrawer } from '@/components/base/ContextDrawer'
import { EmptyPermissionsState } from '@/components/feedback/EmptyPermissionsState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { PermissionsChecklist } from '@/components/forms/PermissionsChecklist'
import { AssignmentSummaryCard } from '@/components/layout/AssignmentSummaryCard'
import {
  useSyncWorkspaceUserApplicationPermissionsMutation,
  useWorkspaceApplicationPermissionsByApplicationQuery,
  useWorkspaceUserApplicationPermissionsByAccessQuery,
} from '@/modules/workspace-permissions/hooks/useWorkspacePermissionsQuery'
import type { WorkspaceUserApplication } from '@/modules/workspace-user-applications/types/workspace-user-application.types'
import { getWorkspaceUserApplicationSummary } from '@/modules/workspace-user-applications/utils/access-display'
import { getErrorMessage } from '@/utils/error-message'

interface AccessPermissionsDrawerProps {
  access: WorkspaceUserApplication | null
  isOpen: boolean
  onClose: () => void
}

function togglePermissionId(current: string[], permissionId: string) {
  return current.includes(permissionId)
    ? current.filter((item) => item !== permissionId)
    : [...current, permissionId]
}

export function AccessPermissionsDrawer({
  access,
  isOpen,
  onClose,
}: AccessPermissionsDrawerProps) {
  const accessId = access?.workspace_user_application_id
  const applicationId = access?.workspace_user_application_workspace_application_id
  const availablePermissionsQuery = useWorkspaceApplicationPermissionsByApplicationQuery(
    applicationId,
  )
  const assignedPermissionsQuery = useWorkspaceUserApplicationPermissionsByAccessQuery(accessId)
  const syncPermissionsMutation = useSyncWorkspaceUserApplicationPermissionsMutation()
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([])

  useEffect(() => {
    if (!isOpen || !assignedPermissionsQuery.data) {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedPermissionIds(
      assignedPermissionsQuery.data.map((item) =>
        String(item.workspace_user_application_permission_wap_id),
      ),
    )
  }, [assignedPermissionsQuery.data, isOpen])

  const summary = access ? getWorkspaceUserApplicationSummary(access) : null
  const availablePermissions = availablePermissionsQuery.data ?? []
  const assignedPermissions = useMemo(
    () => assignedPermissionsQuery.data ?? [],
    [assignedPermissionsQuery.data],
  )
  const hasChanges = useMemo(() => {
    const current = assignedPermissions.map((item) =>
      String(item.workspace_user_application_permission_wap_id),
    )

    return (
      current.length !== selectedPermissionIds.length ||
      current.some((permissionId) => !selectedPermissionIds.includes(permissionId))
    )
  }, [assignedPermissions, selectedPermissionIds])

  async function handleSave() {
    if (!accessId) {
      return
    }

    if (!hasChanges) {
      onClose()
      return
    }

    await syncPermissionsMutation.mutateAsync({
      workspaceUserApplicationId: accessId,
      currentAssignments: assignedPermissions,
      selectedPermissionIds,
    })
    setSelectedPermissionIds([])
    onClose()
  }

  return (
    <ContextDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Gestionar permisos"
      description="Asigna o revoca permisos dentro de la app seleccionada sin exponer IDs técnicos."
      footer={
        <div className="form-actions form-actions--end">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            isLoading={syncPermissionsMutation.isPending}
            leftIcon={<Save size={16} />}
            onClick={() => void handleSave()}
          >
            Guardar permisos
          </Button>
        </div>
      }
    >
      {!access || !summary ? null : (
        <div className="crud-grid">
          <AssignmentSummaryCard
            userName={summary.userName}
            userEmail={summary.userEmail}
            applicationName={summary.applicationName}
            isActive={summary.isActive}
            permissionsCount={assignedPermissions.length}
          />

          {availablePermissionsQuery.isLoading || assignedPermissionsQuery.isLoading ? (
            <LoadingState message="Cargando permisos disponibles..." />
          ) : null}

          {availablePermissionsQuery.error ? (
            <ErrorState description={getErrorMessage(availablePermissionsQuery.error)} />
          ) : null}

          {assignedPermissionsQuery.error ? (
            <ErrorState description={getErrorMessage(assignedPermissionsQuery.error)} />
          ) : null}

          {!availablePermissionsQuery.isLoading &&
          !assignedPermissionsQuery.isLoading &&
          !availablePermissionsQuery.error &&
          !assignedPermissionsQuery.error ? (
            availablePermissions.length ? (
              <PermissionsChecklist
                permissions={availablePermissions}
                selectedPermissionIds={selectedPermissionIds}
                onToggle={(permissionId) =>
                  setSelectedPermissionIds((current) =>
                    togglePermissionId(current, permissionId),
                  )
                }
                disabled={syncPermissionsMutation.isPending}
              />
            ) : (
              <EmptyPermissionsState
                title="Sin permisos configurados para esta app"
                description="Primero registra permisos en el catálogo de la aplicación y luego podrás asignarlos a este acceso."
              />
            )
          ) : null}

          {!availablePermissionsQuery.isLoading &&
          !assignedPermissionsQuery.isLoading &&
          !availablePermissionsQuery.error &&
          !assignedPermissionsQuery.error &&
          availablePermissions.length ? (
            <p className="text-muted">
              Selecciona los permisos que debe tener este usuario dentro de la aplicación.
            </p>
          ) : null}

          {!hasChanges && availablePermissions.length ? (
            <p className="text-muted">No hay cambios pendientes por guardar.</p>
          ) : null}
        </div>
      )}
    </ContextDrawer>
  )
}
