import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/base/Card'
import { APP_ROUTES } from '@/routes/paths'

export function NotFoundPage() {
  return (
    <div className="page-center">
      <Card className="status-card">
        <span className="status-card__icon">
          <Compass size={22} />
        </span>
        <h1>Página no encontrada</h1>
        <p>La ruta solicitada no existe dentro del Workspace.</p>
        <Link className="button button--primary" to={APP_ROUTES.dashboard}>
          Ir al inicio
        </Link>
      </Card>
    </div>
  )
}
