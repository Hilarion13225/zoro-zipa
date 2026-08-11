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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post<{ url: string }>('/upload', formData)
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
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={handleFileChange}
          className={`${inputClass} cursor-pointer file:cursor-pointer`}
        />

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
