import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-shell__main">
        <Topbar />
        <main className="dashboard-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
