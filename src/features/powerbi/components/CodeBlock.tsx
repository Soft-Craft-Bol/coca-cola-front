import { useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'

interface Props {
  code: string
  filename?: string
  maxHeight?: number
}

// Bloque de código con botones para copiar y descargar
export default function CodeBlock({ code, filename, maxHeight = 360 }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* el navegador bloqueó el portapapeles */
    }
  }

  const save = () => {
    const href = URL.createObjectURL(new Blob([code], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = href
    a.download = filename ?? 'codigo.txt'
    a.click()
    URL.revokeObjectURL(href)
  }

  return (
    <div className="codeblock">
      <div className="codeblock-bar">
        <button className="btn small icon-inline" onClick={copy}>
          {copied ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
        </button>
        {filename && <button className="btn small icon-inline" onClick={save}><Download size={14} /> Descargar</button>}
      </div>
      <pre style={{ maxHeight }}><code>{code}</code></pre>
    </div>
  )
}
