import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div
      className="dashboard-shell"
      style={{
        gridTemplateColumns: sidebarCollapsed ? '5.5rem minmax(0, 1fr)' : '17rem minmax(0, 1fr)',
      }}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div className="dashboard-shell__main">
        <Topbar />
        <main className="dashboard-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
