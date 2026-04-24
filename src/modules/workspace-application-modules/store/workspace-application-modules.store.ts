import { create } from 'zustand'
import { workspaceApplicationModulesService } from '@/modules/workspace-application-modules/api/workspace-application-modules.service'
import type {
  CreateWorkspaceApplicationModuleDto,
  UpdateWorkspaceApplicationModuleDto,
  WorkspaceApplicationModule,
  WorkspaceApplicationModuleFilters,
} from '@/modules/workspace-application-modules/types/workspace-application-module.types'
import type { EntityId } from '@/types/common'
import { getErrorMessage } from '@/utils/error-message'

interface WorkspaceApplicationModulesState {
  modules: WorkspaceApplicationModule[]
  selectedModule: WorkspaceApplicationModule | null
  isLoading: boolean
  error: string | null
  fetchModules: (filters?: WorkspaceApplicationModuleFilters) => Promise<void>
  fetchModuleById: (id: EntityId) => Promise<void>
  createModule: (payload: CreateWorkspaceApplicationModuleDto) => Promise<void>
  updateModule: (id: EntityId, payload: UpdateWorkspaceApplicationModuleDto) => Promise<void>
  deleteModule: (id: EntityId) => Promise<void>
  clearSelectedModule: () => void
  clearError: () => void
}

export const useWorkspaceApplicationModulesStore =
  create<WorkspaceApplicationModulesState>((set, get) => ({
    modules: [],
    selectedModule: null,
    isLoading: false,
    error: null,
    async fetchModules(filters) {
      set({ isLoading: true, error: null })
      try {
        const modules = await workspaceApplicationModulesService.list(filters)
        set({ modules, isLoading: false })
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false })
      }
    },
    async fetchModuleById(id) {
      set({ isLoading: true, error: null })
      try {
        const selectedModule = await workspaceApplicationModulesService.getById(id)
        set({ selectedModule, isLoading: false })
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false })
      }
    },
    async createModule(payload) {
      set({ isLoading: true, error: null })
      try {
        const createdModule = await workspaceApplicationModulesService.create(payload)
        set({
          modules: [...get().modules, createdModule],
          selectedModule: createdModule,
          isLoading: false,
        })
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false })
        throw error
      }
    },
    async updateModule(id, payload) {
      set({ isLoading: true, error: null })
      try {
        const updatedModule = await workspaceApplicationModulesService.update(id, payload)
        set({
          modules: get().modules.map((module) =>
            String(module.workspace_application_module_id) === String(id)
              ? updatedModule
              : module,
          ),
          selectedModule: updatedModule,
          isLoading: false,
        })
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false })
        throw error
      }
    },
    async deleteModule(id) {
      set({ isLoading: true, error: null })
      try {
        await workspaceApplicationModulesService.remove(id)
        set({
          modules: get().modules.filter(
            (module) =>
              String(module.workspace_application_module_id) !== String(id),
          ),
          selectedModule:
            String(get().selectedModule?.workspace_application_module_id) === String(id)
              ? null
              : get().selectedModule,
          isLoading: false,
        })
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false })
        throw error
      }
    },
    clearSelectedModule() {
      set({ selectedModule: null })
    },
    clearError() {
      set({ error: null })
    },
  }))
