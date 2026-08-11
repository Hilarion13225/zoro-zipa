import { AdminHeader } from './AdminHeader'

interface ComingSoonProps {
  title: string
  subtitle: string
}

export function ComingSoon({ title, subtitle }: ComingSoonProps) {
  return (
    <div>
      <AdminHeader title={title} subtitle={subtitle} />
      <div className="rounded-lg border border-ink/10 bg-ivory-dim p-12 text-center">
        <div className="mb-4 text-4xl">🚧</div>
        <p className="text-lg font-medium text-ink mb-2">Section en construction</p>
        <p className="text-ink/60">Cette section sera disponible bientôt</p>
      </div>
    </div>
  )
}
