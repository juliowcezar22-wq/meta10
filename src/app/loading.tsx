export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-purple animate-bounce" style={{ animationDelay: '300ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-success-500 animate-bounce" style={{ animationDelay: '450ms' }} />
        </div>
        <p className="text-surface-400 text-xs font-medium tracking-wider uppercase">Carregando</p>
      </div>
    </div>
  )
}
