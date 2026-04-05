import { ShieldX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/base/Button'
import { Card } from '@/components/base/Card'
import { APP_ROUTES } from '@/routes/paths'

export function UnauthorizedPage() {
  const navigate = useNavigate()

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
        <Button onClick={() => navigate(APP_ROUTES.dashboard)}>Volver al dashboard</Button>
      </Card>
    </div>
  )
}
