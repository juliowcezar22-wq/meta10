export default function AlunoLoading() {
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="animate-pulse space-y-8">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-surface-200 rounded-lg" />
            <div className="h-9 w-36 bg-surface-200 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-surface-200/60 rounded-2xl" />
            ))}
          </div>
          <div className="h-6 w-40 bg-surface-200 rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 bg-surface-200/60 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
