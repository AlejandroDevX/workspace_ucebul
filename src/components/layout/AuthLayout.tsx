import { KeyRound, Shield, Workflow } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import { APP_ROUTES } from '@/routes/paths'
import { cn } from '@/utils/classnames'

const highlights = [
  {
    icon: Shield,
    title: 'Accesos centralizados',
    description: 'Administra el ingreso al ecosistema desde un solo lugar, con control claro sobre usuarios y sesiones.',
  },
  {
    icon: Workflow,
    title: 'Gestión diaria más simple',
    description: 'Consulta, organiza y actualiza la información clave del workspace sin fricción en la operación.',
  },
  {
    icon: KeyRound,
    title: 'Recuperación segura',
    description: 'Facilita la recuperación de acceso para tu equipo con un proceso guiado y confiable.',
  },
] as const

export function AuthLayout() {
  const location = useLocation()
  const isLoginPage = location.pathname === APP_ROUTES.login

  return (
    <main className={cn('auth-shell', isLoginPage && 'auth-shell--login')}>
      <section className="auth-shell__hero">
        <div className="auth-shell__brand">
          <span className="auth-shell__brand-mark">
            <img className="auth-shell__brand-logo" src="/ucebul.png" alt="Ucebul" />
          </span>
          <div>
            <p className="auth-shell__eyebrow">Ucebul Ecosystem</p>
            <h1>Workspace Platform</h1>
          </div>
        </div>

        <div className="auth-shell__copy">
          <p className="auth-shell__lead">
            Gestiona usuarios, permisos y accesos del ecosistema Ucebul desde una sola plataforma.
          </p>
        </div>

        <div className="auth-shell__highlights">
          {highlights.map((item) => {
            const Icon = item.icon

            return (
              <article key={item.title} className="auth-shell__highlight">
                <span className="auth-shell__highlight-icon">
                  <Icon size={18} />
                </span>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="auth-shell__content">
        <Outlet />
      </section>
    </main>
  )
}
