import { useState } from 'react'
import { Upload, Link as LinkIcon } from 'lucide-react'
import { FormField, inputClass } from './FormField'
import { api } from '../../api/client'

interface ImageUploadProps {
  label?: string
  value: string
  onChange: (url: string) => void
  preview?: boolean
}

export function ImageUpload({ label = 'Image', value, onChange, preview = true }: ImageUploadProps) {
  const [mode, setMode] = useState<'url' | 'file'>('url')
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post<{ url: string }>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(response.data.url)
    } catch (error) {
      alert('Erreur d\'upload: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <FormField label={label}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm transition-colors ${
              mode === 'url' ? 'bg-gold/20 text-gold' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
            }`}
          >
            <LinkIcon size={14} className="mr-1 inline" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode('file')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm transition-colors ${
              mode === 'file' ? 'bg-gold/20 text-gold' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
            }`}
          >
            <Upload size={14} className="mr-1 inline" />
            Fichier
          </button>
        </div>

        {mode === 'url' && (
          <input
            type="url"
            placeholder="https://..."
            className={inputClass}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {mode === 'file' && (
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileChange}
            className={`${inputClass} cursor-pointer file:cursor-pointer`}
          />
        )}

        {uploading && <p className="text-xs text-ink/50">Upload en cours...</p>}

        {preview && value && (
          <div className="mt-2">
            <img src={value} alt="Preview" className="h-24 w-32 rounded object-cover" />
          </div>
        )}
      </div>
    </FormField>
  )
}
