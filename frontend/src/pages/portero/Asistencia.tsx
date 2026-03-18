import QRScanner from '../../components/QRScanner'
import SidebarPortero from '../../components/SidebarPortero'

import { registrarAsistencia } from '../../services/asistencia.service'

export default function Asistencia() {

  const handleScan = (data: string) => {
    if (!data) return

    registrarAsistencia({
      codigo: data,
      tipo_registro: 'QR'
    })
  }

  return (
    <div>
      <SidebarPortero />
      <h2>Escaneo QR</h2>

      <QRScanner onScan={handleScan} />
    </div>
  )
}