export default function Loading() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 w-1/3">
          <div className="h-8 bg-surface-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-surface-100 rounded animate-pulse w-full" />
        </div>
        <div className="h-10 w-32 bg-surface-200 rounded animate-pulse" />
      </div>
      
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6 space-y-4">
        <div className="flex gap-4">
          <div className="h-10 bg-surface-100 rounded animate-pulse w-full max-w-md" />
        </div>
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-surface-50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
