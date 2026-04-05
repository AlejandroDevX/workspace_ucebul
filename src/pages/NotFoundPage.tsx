import { Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/base/Button'
import { Card } from '@/components/base/Card'
import { APP_ROUTES } from '@/routes/paths'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="page-center">
      <Card className="status-card">
        <span className="status-card__icon">
          <Compass size={22} />
        </span>
        <h1>Página no encontrada</h1>
        <p>La ruta solicitada no existe dentro del Workspace.</p>
        <Button onClick={() => navigate(APP_ROUTES.dashboard)}>Ir al inicio</Button>
      </Card>
    </div>
  )
}
