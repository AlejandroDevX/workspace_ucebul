import { KeyRound, Shield, Workflow } from 'lucide-react'
import { Outlet } from 'react-router-dom'

const highlights = [
  {
    icon: Shield,
    title: 'Autenticación global',
    description: 'La sesión del workspace queda preparada para validar token, recuperar sesión e invalidar accesos.',
  },
  {
    icon: Workflow,
    title: 'Módulos desacoplados',
    description: 'La UI temporal no depende de Axios ni de detalles del backend Laravel.',
  },
  {
    icon: KeyRound,
    title: 'Recuperación por OTP',
    description: 'El flujo de correo, verificación y reseteo queda listo para conectarse contra la API existente.',
  },
] as const

export function AuthLayout() {
  return (
    <main className="auth-shell">
      <section className="auth-shell__hero">
        <div className="auth-shell__brand">
          <span className="auth-shell__brand-mark">UW</span>
          <div>
            <p className="auth-shell__eyebrow">Ucebul Ecosystem</p>
            <h1>Workspace Platform</h1>
          </div>
        </div>

        <div className="auth-shell__copy">
          <p className="auth-shell__lead">
            Base administrativa moderna para operar usuarios, roles, aplicaciones y permisos del ecosistema.
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
