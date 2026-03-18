import { useState } from 'react'
import { QrReader } from 'react-qr-reader'

interface Props {
  onScan: (data: string) => void
}

export default function QRScanner({ onScan }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [permission, setPermission] = useState<'pending' | 'granted' | 'denied'>('pending')

  return (
    <>
      <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

        .qr-wrapper {
          width: 100%;
          position: relative;
          background: #0a1628;
          border-radius: 12px;
          overflow: hidden;
        }

        /* Override react-qr-reader internal styles */
        .qr-wrapper video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block;
          border-radius: 12px;
        }

        .qr-wrapper > div {
          width: 100% !important;
          padding-top: 0 !important;
          height: auto !important;
        }

        /* Permission / loading overlay */
        .qr-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: rgba(10, 22, 40, 0.92);
          border-radius: 12px;
          z-index: 5;
          padding: 24px;
          text-align: center;
        }

        .qr-overlay-icon {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 4px;
        }

        .qr-overlay-title {
          font-family: 'Lato', sans-serif;
          font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.8);
        }

        .qr-overlay-sub {
          font-family: 'Lato', sans-serif;
          font-size: 12px; color: rgba(255,255,255,0.35); line-height: 1.5;
        }

        /* Error bar */
        .qr-error-bar {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; margin-top: 10px;
          background: rgba(247,111,111,0.1); border: 1px solid rgba(247,111,111,0.3);
          border-radius: 10px; font-family: 'Lato', sans-serif;
          font-size: 12px; color: #f76f6f;
        }

        /* Spinner */
        .qr-spin { animation: qrSpin 1s linear infinite; display: inline-block; }
        @keyframes qrSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="qr-wrapper">

          {/* Placeholder height so layout doesn't collapse */}
          <div style={{ paddingTop: '75%', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <QrReader
                constraints={{ facingMode: 'user' }} // cámara frontal de PC/laptop
                onResult={(result, err) => {
                  if (result?.text) {
                    setError(null);
                    setPermission('granted');
                    onScan(result.text);
                  } else if (err) {
                    if (err.name === 'NotAllowedError') {
                      setPermission('denied');
                    } else if (err.name !== 'NotFoundException') {
                      setError('Error al leer el código QR');
                    } else {
                      setPermission('pending');
                    }
                  }
                }}
                videoStyle={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                containerStyle={{ width: '100%', height: '100%', borderRadius: 12 }}
              />
            </div>
          </div>

          {/* Denied overlay */}
          {permission === 'denied' && (
            <div className="qr-overlay">
              <div className="qr-overlay-icon" style={{ background: 'rgba(247,111,111,0.15)', color: '#f76f6f' }}>
                <i className="fa-solid fa-camera-slash"></i>
              </div>
              <div className="qr-overlay-title">Cámara no permitida</div>
              <div className="qr-overlay-sub">
                Permite el acceso a la cámara en la configuración de tu navegador para escanear códigos QR.
              </div>
            </div>
          )}

          {/* Waiting overlay */}
          {permission === 'pending' && (
            <div className="qr-overlay">
              <div className="qr-overlay-icon" style={{ background: 'rgba(79,142,247,0.15)', color: '#4f8ef7' }}>
                <i className="fa-solid fa-circle-notch qr-spin"></i>
              </div>
              <div className="qr-overlay-title">Iniciando cámara...</div>
              <div className="qr-overlay-sub">Permite el acceso cuando el navegador lo solicite.</div>
            </div>
          )}

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
    </>
  )
}