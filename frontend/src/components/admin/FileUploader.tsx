import { useState } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { api } from '../../api/client'

interface UploadedFile {
  url: string
  originalName?: string
  fileName?: string
}

interface FileUploaderProps {
  onFileSelected: (file: UploadedFile) => void
  acceptedTypes?: string
}

export function FileUploader({ onFileSelected, acceptedTypes = 'image/*,video/*' }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post<{ url: string }>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const uploadedFile: UploadedFile = {
        url: response.data.url,
        originalName: file.name,
      }
      onFileSelected(uploadedFile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="rounded-lg border-2 border-dashed border-gold/30 p-8 text-center">
        <label className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <Upload size={32} className="text-gold" />
            <div>
              <p className="font-medium text-ink">Télécharger un fichier</p>
              <p className="text-xs text-ink/60">Cliquez pour sélectionner</p>
            </div>
          </div>
          <input
            type="file"
            accept={acceptedTypes}
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {uploading && <p className="text-sm text-gold">Téléchargement en cours...</p>}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  )
}
