import type { WorkspaceUserApplication } from '@/modules/workspace-user-applications/types/workspace-user-application.types'

export function getWorkspaceUserApplicationSummary(access: WorkspaceUserApplication) {
  const user = access.workspace_user
  const application = access.workspace_application
  const userName = user
    ? `${user.workspace_user_name} ${user.workspace_user_last_name}`
    : `Usuario #${access.workspace_user_application_workspace_user_id}`
  const userEmail = user?.workspace_user_email
  const applicationName =
    application?.workspace_application_name ??
    `Aplicación #${access.workspace_user_application_workspace_application_id}`

  return {
    userName,
    userEmail,
    applicationName,
    isActive: access.workspace_user_application_is_active,
  }
}
