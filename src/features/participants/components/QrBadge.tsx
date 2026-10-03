import { QRCodeSVG } from 'qrcode.react'
import type { Participant } from '@/shared/types'

// Credencial con el QR que se escanea al ingresar al evento
export default function QrBadge({ participant, eventName }: { participant: Participant; eventName?: string }) {
  return (
    <div className="qr-box" style={{ gap: 8 }}>
      <strong>{eventName}</strong>
      <QRCodeSVG value={participant.qrCode} size={170} />
      <code>{participant.qrCode}</code>
      <span>{participant.firstName} {participant.lastName}</span>
    </div>
  )
}
