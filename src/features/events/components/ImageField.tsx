import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { IMAGE_ACCEPT, MAX_IMAGE_MB, optimizeImage, validateImage } from '@/shared/utils/image'

interface Props {
  currentUrl?: string | null
  file: File | null
  removed: boolean
  onChange: (file: File | null, removed: boolean) => void
}

// Imagen opcional del evento: elegir, previsualizar, reemplazar o quitar
export default function ImageField({ currentUrl, file, removed, onChange }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const shown = preview ?? (removed ? undefined : optimizeImage(currentUrl, 640, 360))

  const pick = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    e.target.value = ''
    if (!selected) return
    const problem = validateImage(selected)
    setError(problem)
    if (!problem) onChange(selected, false)
  }

  const remove = () => {
    setError(null)
    // Si solo había una imagen nueva sin guardar, se descarta; si era la guardada, se marca para eliminar
    onChange(null, Boolean(currentUrl))
  }

  return (
    <div className="field full">
      <span>Imagen del evento <span className="hint">(opcional · JPG, PNG, WEBP o GIF, máx. {MAX_IMAGE_MB} MB)</span></span>
      <div className="image-field">
        {shown ? (
          <img src={shown} alt="Vista previa de la imagen del evento" className="image-preview" />
        ) : (
          <div className="image-empty"><ImagePlus size={28} /><span>Sin imagen</span></div>
        )}
        <div className="row">
          <input ref={input} type="file" accept={IMAGE_ACCEPT} onChange={pick} hidden />
          <button type="button" className="btn small icon-inline" onClick={() => input.current?.click()}>
            <ImagePlus size={14} /> {shown ? 'Cambiar imagen' : 'Seleccionar imagen'}
          </button>
          {shown && (
            <button type="button" className="btn small danger icon-inline" onClick={remove}>
              <Trash2 size={14} /> Quitar imagen
            </button>
          )}
        </div>
        {error && <div className="error-box">{error}</div>}
      </div>
    </div>
  )
}
