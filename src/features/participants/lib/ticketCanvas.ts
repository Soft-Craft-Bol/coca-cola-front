import poster from '@/assets/ticket-poster.jpg'
import logoWhite from '@/assets/coca-cola-logo-white.png'

export interface TicketData {
  participantName: string
  eventName: string
  eventDate: string
  location: string
  code: string
  typeLabel: string
}

export const TICKET_W = 1080
export const TICKET_H = 1860
const FONT = '"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif'

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width <= maxWidth || !line) {
      line = test
    } else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines)
    let last = kept[maxLines - 1]
    while (ctx.measureText(`${last}…`).width > maxWidth && last.length > 1) last = last.slice(0, -1)
    kept[maxLines - 1] = `${last}…`
    return kept
  }
  return lines
}

const spaced = (ctx: CanvasRenderingContext2D, value: string) => {
  ;(ctx as unknown as { letterSpacing?: string }).letterSpacing = value
}

const formatWhen = (iso: string) => {
  const text = new Intl.DateTimeFormat('es-BO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Dibuja la entrada: fondo rojo, datos del evento, QR sobre la imagen de Coca-Cola y código. */
export async function drawTicket(canvas: HTMLCanvasElement, data: TicketData, qrDataUrl: string) {
  const W = TICKET_W
  const H = TICKET_H
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  try {
    await Promise.all([document.fonts.load(`700 60px ${FONT}`), document.fonts.load(`500 30px ${FONT}`), document.fonts.load(`600 24px ${FONT}`)])
  } catch { /* se usa la fuente de respaldo */ }
  const [posterImg, logoImg, qrImg] = await Promise.all([loadImage(poster), loadImage(logoWhite), loadImage(qrDataUrl)])

  // fondo
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#2b0407')
  bg.addColorStop(0.45, '#6d0a12')
  bg.addColorStop(1, '#a00f1a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(W * 0.85, 260, 0, W * 0.85, 260, 620)
  glow.addColorStop(0, 'rgba(255, 60, 70, 0.45)')
  glow.addColorStop(1, 'rgba(255, 60, 70, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // imagen de Coca-Cola abajo, con el borde superior difuminado
  const scale = W / posterImg.width
  const ph = Math.ceil(posterImg.height * scale)
  const layer = document.createElement('canvas')
  layer.width = W
  layer.height = ph
  const lc = layer.getContext('2d')
  if (lc) {
    lc.drawImage(posterImg, 0, 0, W, ph)
    lc.globalCompositeOperation = 'destination-out'
    const fade = lc.createLinearGradient(0, 0, 0, 280)
    fade.addColorStop(0, 'rgba(0,0,0,1)')
    fade.addColorStop(1, 'rgba(0,0,0,0)')
    lc.fillStyle = fade
    lc.fillRect(0, 0, W, 280)
    ctx.drawImage(layer, 0, H - ph)
  }
  const foot = ctx.createLinearGradient(0, H - 240, 0, H)
  foot.addColorStop(0, 'rgba(20, 0, 2, 0)')
  foot.addColorStop(1, 'rgba(20, 0, 2, 0.7)')
  ctx.fillStyle = foot
  ctx.fillRect(0, H - 240, W, 240)

  // cabecera
  ctx.drawImage(logoImg, 70, 64, 300, (300 * logoImg.height) / logoImg.width)
  ctx.font = `600 26px ${FONT}`
  spaced(ctx, '3px')
  const label = data.typeLabel.toUpperCase()
  const pillW = ctx.measureText(label).width + 56
  ctx.fillStyle = 'rgba(255, 255, 255, 0.14)'
  roundRect(ctx, W - 70 - pillW, 78, pillW, 58, 29)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, W - 70 - pillW + 28, 108)
  spaced(ctx, '0px')

  // evento
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#fff'
  ctx.font = `700 66px ${FONT}`
  let y = 250
  for (const line of wrap(ctx, data.eventName, W - 140, 2)) {
    ctx.fillText(line, 70, y)
    y += 76
  }
  ctx.font = `500 32px ${FONT}`
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
  ctx.fillText(formatWhen(data.eventDate), 70, y + 10)
  ctx.fillText(wrap(ctx, data.location, W - 140, 1)[0] ?? '', 70, y + 56)

  // participante
  const py = y + 140
  ctx.font = `600 22px ${FONT}`
  spaced(ctx, '4px')
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.fillText('PARTICIPANTE', 70, py)
  spaced(ctx, '0px')
  ctx.font = `700 50px ${FONT}`
  ctx.fillStyle = '#fff'
  ctx.fillText(wrap(ctx, data.participantName, W - 140, 1)[0] ?? '', 70, py + 62)

  // tarjeta con el QR
  const cardW = 480
  const cardH = 590
  const cardX = (W - cardW) / 2
  const cardY = py + 120
  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
  ctx.shadowBlur = 50
  ctx.shadowOffsetY = 18
  ctx.fillStyle = '#fff'
  roundRect(ctx, cardX, cardY, cardW, cardH, 40)
  ctx.fill()
  ctx.restore()
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(qrImg, cardX + 50, cardY + 50, 380, 380)
  ctx.imageSmoothingEnabled = true
  ctx.textAlign = 'center'
  ctx.fillStyle = '#111'
  ctx.font = `700 44px ${FONT}`
  spaced(ctx, '3px')
  ctx.fillText(data.code, W / 2, cardY + 500)
  spaced(ctx, '0px')
  ctx.fillStyle = '#6b7280'
  ctx.font = `500 25px ${FONT}`
  ctx.fillText('Presenta este código en la entrada', W / 2, cardY + 548)

  // pie
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.font = `600 26px ${FONT}`
  ctx.fillText('Coca-Cola · Eventos', W / 2, H - 56)
  ctx.textAlign = 'left'
}
