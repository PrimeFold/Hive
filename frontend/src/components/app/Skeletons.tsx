export function MessageSkeleton() {
  return (
    <div className="px-4 py-4 space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-2.5 animate-pulse">
          <div className="w-9 h-9 rounded-full bg-secondary shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <div className="h-3 w-20 bg-secondary rounded" />
              <div className="h-3 w-12 bg-secondary/60 rounded" />
            </div>
            <div className="h-3 w-3/4 bg-secondary rounded" />
            {i % 2 === 0 && <div className="h-3 w-1/2 bg-secondary/60 rounded" />}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="p-3 space-y-3 animate-pulse">
      <div className="h-4 w-24 bg-secondary rounded mb-4" />
      <div className="h-3 w-16 bg-secondary/60 rounded mb-2" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-7 w-full bg-secondary rounded-md" />
      ))}
      <div className="h-3 w-16 bg-secondary/60 rounded mt-4 mb-2" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-secondary" />
          <div className="h-3 w-20 bg-secondary rounded" />
        </div>
      ))}
    </div>
  );
}
