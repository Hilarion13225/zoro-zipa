import { useState } from 'react'
import { FormField, inputClass } from './FormField'
import { api } from '../../api/client'

interface ImageUploadProps {
  label?: string
  value: string
  onChange: (url: string) => void
  preview?: boolean
}

export function ImageUpload({ label = 'Image', value, onChange, preview = true }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  // Shown instantly from the local file while the upload is in progress.
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    setLocalPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post<{ url: string }>('/upload', formData)
      onChange(response.data.url)
    } catch (error) {
      alert('Erreur d\'upload: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
      setLocalPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const previewSrc = localPreview || value

  return (
    <FormField label={label}>
      <div className="space-y-3">
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={handleFileChange}
          className={`${inputClass} cursor-pointer file:cursor-pointer`}
        />

        {uploading && <p className="text-xs text-ink/50">Upload en cours...</p>}

        {preview && previewSrc && (
          <div className="mt-2">
            <img src={previewSrc} alt="Preview" className="h-24 w-32 rounded object-cover" />
          </div>
        )}
      </div>
    </FormField>
  )
}