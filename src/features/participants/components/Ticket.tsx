import { useEffect, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, QrCode, Share2 } from 'lucide-react'
import { drawTicket, type TicketData } from '../lib/ticketCanvas'

const save = (blob: Blob, filename: string) => {
  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  a.click()
  URL.revokeObjectURL(href)
}

// Entrada del participante: imagen descargable con el QR sobre el diseño de Coca-Cola
export default function Ticket({ data }: { data: TicketData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const qrRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const key = JSON.stringify(data)

  useEffect(() => {
    const canvas = canvasRef.current
    const qr = qrRef.current
    if (!canvas || !qr) return
    let cancelled = false
    setReady(false)
    drawTicket(canvas, JSON.parse(key) as TicketData, qr.toDataURL('image/png')).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => { cancelled = true }
  }, [key])

  const ticketBlob = () => new Promise<Blob | null>((resolve) => canvasRef.current?.toBlob(resolve, 'image/png'))

  const downloadTicket = async () => {
    const blob = await ticketBlob()
    if (blob) save(blob, `entrada-${data.code}.png`)
  }

  const downloadQr = () => {
    const qr = qrRef.current
    if (!qr) return
    const pad = 60
    const size = qr.width * 2
    const out = document.createElement('canvas')
    out.width = size + pad * 2
    out.height = size + pad * 2 + 90
    const ctx = out.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, out.width, out.height)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(qr, pad, pad, size, size)
    ctx.fillStyle = '#111'
    ctx.font = '700 44px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(data.code, out.width / 2, size + pad * 2 + 30)
    out.toBlob((blob) => blob && save(blob, `qr-${data.code}.png`), 'image/png')
  }

  const share = async () => {
    const blob = await ticketBlob()
    if (!blob) return
    const file = new File([blob], `entrada-${data.code}.png`, { type: 'image/png' })
    try {
      await navigator.share({ files: [file], title: `Entrada · ${data.eventName}` })
    } catch { /* el usuario canceló */ }
  }

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof navigator.canShare === 'function'

  return (
    <div className="ticket-wrap">
      <QRCodeCanvas ref={qrRef} value={data.code} size={380} level="H" marginSize={0} style={{ display: 'none' }} />
      <canvas ref={canvasRef} className="ticket-canvas" style={{ opacity: ready ? 1 : 0.4 }} aria-label={`Entrada de ${data.participantName}`} />
      <div className="ticket-actions">
        <button className="btn primary icon-inline" disabled={!ready} onClick={downloadTicket}><Download size={15} /> Descargar entrada</button>
        <button className="btn icon-inline" disabled={!ready} onClick={downloadQr}><QrCode size={15} /> Solo el QR</button>
        {canShare && <button className="btn icon-inline" disabled={!ready} onClick={share}><Share2 size={15} /> Compartir</button>}
      </div>
    </div>
  )
}
