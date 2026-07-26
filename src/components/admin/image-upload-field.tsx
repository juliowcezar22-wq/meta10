'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB (mesmo limite dos buckets)

interface ImageUploadFieldProps {
  bucket: 'product-images' | 'question-images'
  value: string | null
  onChange: (url: string | null) => void
  label?: string
}

/**
 * Upload de imagem para o Supabase Storage com validação (jpg/png/webp,
 * até 2 MB), preview, trocar e remover. Guarda apenas a URL pública —
 * quem salva a URL no registro é o formulário que usa o componente.
 */
export function ImageUploadField({ bucket, value, onChange, label = 'Imagem' }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Formato inválido. Use JPG, PNG ou WebP.')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('Arquivo muito grande. O limite é 2 MB.')
      return
    }

    setIsUploading(true)
    const supabase = createClient()
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const path = `${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type, cacheControl: '3600' })

    if (uploadError) {
      console.error('[ImageUploadField]', uploadError)
      setError('Falha no upload. Verifique sua permissão e tente novamente.')
      setIsUploading(false)
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    onChange(data.publicUrl)
    setIsUploading(false)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-surface-700 mb-1">{label}</label>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      {value ? (
        <div className="space-y-2">
          {/* Preview */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview da imagem"
            className="w-full h-40 object-cover rounded-lg border border-surface-200 bg-surface-50"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-600 hover:text-primary bg-surface-50 hover:bg-primary/5 border border-surface-200 rounded-lg transition-colors disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Trocar imagem
            </button>
            <button
              type="button"
              onClick={() => { onChange(null); setError(null) }}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-600 hover:text-danger-600 bg-surface-50 hover:bg-danger-50 border border-surface-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remover
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full h-28 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-surface-300 rounded-lg text-surface-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-medium">Enviando...</span>
            </>
          ) : (
            <>
              <ImagePlus className="w-6 h-6" />
              <span className="text-xs font-medium">Selecionar imagem (JPG, PNG ou WebP, até 2 MB)</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-danger-600 mt-1.5">{error}</p>}
    </div>
  )
}
