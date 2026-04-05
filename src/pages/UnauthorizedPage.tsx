import { ShieldX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/base/Card'
import { APP_ROUTES } from '@/routes/paths'

export function UnauthorizedPage() {
  return (
    <div className="page-center">
      <Card className="status-card">
        <span className="status-card__icon">
          <ShieldX size={22} />
        </span>
        <h1>Acceso restringido</h1>
        <p>
          Tu sesión es válida, pero no tiene los roles globales necesarios para esta vista.
        </p>
        <Link className="button button--primary" to={APP_ROUTES.dashboard}>
          Volver al dashboard
        </Link>
      </Card>
    </div>
  )
}
