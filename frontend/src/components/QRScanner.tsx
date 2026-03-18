import { useState, useEffect } from 'react'
import { QrReader } from 'react-qr-reader'

interface Props {
  onScan: (data: string) => void
}

export default function QRScanner({ onScan }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [permission, setPermission] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [scannedText, setScannedText] = useState<string>('')

  // 🔹 Mensaje de voz cuando permission cambie
  useEffect(() => {
    let mensaje: SpeechSynthesisUtterance | null = null

    if (permission === 'pending') {
      mensaje = new SpeechSynthesisUtterance('Iniciando cámara, permite el acceso cuando el navegador lo solicite')
    } else if (permission === 'denied') {
      mensaje = new SpeechSynthesisUtterance('Cámara no permitida, habilita el acceso en la configuración')
    }

    if (mensaje) {
      window.speechSynthesis.speak(mensaje)
    }
  }, [permission])

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="qr-wrapper">
        <div style={{ paddingTop: '75%', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <QrReader
              constraints={{ facingMode: 'user' }}
              onResult={(result, err) => {
                if (result?.text && result.text.trim() !== '') {
                  setError(null)
                  setPermission('granted')
                  setScannedText(result.text)
                  onScan(result.text)

                  const mensajeQR = new SpeechSynthesisUtterance('Asistencia registrada')
                  window.speechSynthesis.speak(mensajeQR)
                } else if (err) {

                  
                    setPermission('pending')
          
                }
              }}
              videoStyle={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
              containerStyle={{ width: '100%', height: '100%', borderRadius: 12 }}
            />
          </div>
        </div>

        {/* Mostrar QR escaneado */}
        <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 14, color: '#fff', background: '#1a1f35', padding: 10, borderRadius: 8 }}>
          <strong>Escaneado:</strong> {scannedText || 'Ninguno'}
        </div>

        {/* Error bar */}
        {error && (
          <div className="qr-error-bar">
            <i className="fa-solid fa-triangle-exclamation"></i>
            {error}
            <button
              onClick={() => setError(null)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f76f6f', cursor: 'pointer', fontSize: 12 }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}