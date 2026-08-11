import { useState } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { api } from '../../api/client'

interface UploadedFile {
  fileId: string
  originalName: string
  fileName: string
  url: string
  size: number
  uploadedAt: string
}

interface FileUploaderProps {
  onFileSelected: (file: UploadedFile) => void
  acceptedTypes?: string
}

export function FileUploader({ onFileSelected, acceptedTypes = 'image/*,video/*' }: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [showLibrary, setShowLibrary] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post<UploadedFile>('/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const uploadedFile = response.data
      setFiles([uploadedFile, ...files])
      onFileSelected(uploadedFile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!window.confirm('Supprimer ce fichier?')) return

    try {
      await api.delete(`/upload/file/${fileId}`)
      setFiles(files.filter((f) => f.fileId !== fileId))
    } catch (err) {
      setError('Erreur lors de la suppression')
    }
  }

  const loadFiles = async () => {
    try {
      const response = await api.get<UploadedFile[]>('/upload/files')
      setFiles(response.data)
    } catch (err) {
      setError('Erreur lors du chargement des fichiers')
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

      {/* Library Toggle */}
      <button
        onClick={() => {
          setShowLibrary(!showLibrary)
          if (!showLibrary && files.length === 0) loadFiles()
        }}
        className="text-sm text-gold hover:text-gold-soft transition-colors"
      >
        {showLibrary ? 'Masquer' : 'Afficher'} la bibliothèque ({files.length})
      </button>

      {/* File Library */}
      {showLibrary && files.length > 0 && (
        <div className="rounded-lg border border-ink/10 overflow-hidden">
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.fileId}
                className="flex items-center gap-4 p-4 border-b border-ink/10 last:border-b-0 hover:bg-ivory-dim/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{file.originalName}</p>
                  <div className="flex gap-4 text-xs text-ink/60">
                    <span>ID: {file.fileId.substring(0, 8)}...</span>
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onFileSelected(file)}
                    className="px-3 py-1.5 text-sm bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors"
                  >
                    Sélectionner
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.fileId)}
                    className="p-1.5 text-ink/60 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showLibrary && files.length === 0 && (
        <p className="text-center text-ink/40 text-sm">Aucun fichier</p>
      )}
    </div>
  )
}
