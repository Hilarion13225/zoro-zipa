import type { FormEvent } from 'react'
import { useState } from 'react'
import { X } from 'lucide-react'
import { FileUploader } from './FileUploader'

interface Field {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'url' | 'checkbox' | 'file' | 'date'
  required?: boolean
  placeholder?: string
  accept?: string
}

interface EntityFormProps {
  title: string
  fields: Field[]
  initialData?: Record<string, any>
  onSubmit: (data: Record<string, any>) => Promise<void>
  onClose: () => void
  isLoading?: boolean
}

export function EntityForm({
  title,
  fields,
  initialData,
  onSubmit,
  onClose,
  isLoading = false,
}: EntityFormProps) {
  const [formData, setFormData] = useState(initialData || {})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, checked } = e.target as any
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await onSubmit(formData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="text-ink/40 hover:text-ink"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-ink/80 mb-2">
                {field.label}
                {field.required && <span className="text-gold">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  name={field.name}
                  checked={formData[field.name] || false}
                  onChange={handleChange}
                  className="h-4 w-4 accent-gold"
                />
              ) : field.type === 'file' ? (
                <FileUploader
                  acceptedTypes={field.accept || 'image/*'}
                  value={formData[field.name] || ''}
                  onFileSelected={(file) => {
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: file.url,
                    }))
                  }}
                />
              ) : field.type === 'date' ? (
                <input
                  type="date"
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full rounded border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
              )}
            </div>
          ))}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded border border-ink/20 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || isLoading}
              className="flex-1 rounded bg-gold px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-gold-soft disabled:opacity-50"
            >
              {submitting ? 'Sauvegarde...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}