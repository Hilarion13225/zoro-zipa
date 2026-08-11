import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { api } from '../../api/client'

interface UploadedFile {
  url: string
  originalName?: string
  fileName?: string
}

interface FileUploaderProps {
  onFileSelected: (file: UploadedFile) => void
  acceptedTypes?: string
  /** Current value (e.g. when editing an existing entity) — shown as the preview until a new file is chosen. */
  value?: string
}

const isVideoUrl = (url: string, mimeType?: string) =>
  mimeType?.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(url)

export function FileUploader({ onFileSelected, acceptedTypes = 'image/*,video/*', value }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  // Local preview shown instantly (blob URL) while the upload is in progress.
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [localPreviewIsVideo, setLocalPreviewIsVideo] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)

    // Show an immediate preview from the local file, before the upload finishes.
    const objectUrl = URL.createObjectURL(file)
    setLocalPreview(objectUrl)
    setLocalPreviewIsVideo(file.type.startsWith('video/'))

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post<{ url: string }>('/upload', formData)

      const uploadedFile: UploadedFile = {
        url: response.data.url,
        originalName: file.name,
      }
      onFileSelected(uploadedFile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
      setLocalPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setLocalPreview(null)
    onFileSelected({ url: '' })
  }

  // Prefer the freshly-selected local file preview; fall back to the existing saved value (edit mode).
  const previewUrl = localPreview || value
  const previewIsVideo = localPreview ? localPreviewIsVideo : isVideoUrl(value || '')

  return (
    <div className="space-y-4">
      {previewUrl && (
        <div className="relative w-fit">
          {previewIsVideo ? (
            <video
              src={previewUrl}
              controls
              className="h-32 max-w-xs rounded-lg border border-ink/10 object-cover"
            />
          ) : (
            <img
              src={previewUrl}
              alt="Aperçu"
              className="h-32 w-32 rounded-lg border border-ink/10 object-cover"
            />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 rounded-full bg-ink p-1 text-ivory shadow hover:bg-red-600"
            aria-label="Retirer le fichier"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div className="rounded-lg border-2 border-dashed border-gold/30 p-8 text-center">
        <label className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <Upload size={32} className="text-gold" />
            <div>
              <p className="font-medium text-ink">
                {previewUrl ? 'Remplacer le fichier' : 'Télécharger un fichier'}
              </p>
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