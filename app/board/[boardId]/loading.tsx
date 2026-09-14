export default function BoardLoading() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col animate-pulse">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-6 w-48 bg-gray-300 rounded border-l pl-4" />
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mb-6 h-12 bg-white rounded-lg border shadow-sm" />

        <div className="flex gap-6 items-start">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-72 bg-gray-200/70 rounded-lg p-3 flex flex-col gap-3 h-125"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 w-24 bg-gray-300 rounded" />
                <div className="h-4 w-6 bg-gray-300 rounded-full" />
              </div>

              <div className="space-y-2 flex-1">
                <div className="h-16 bg-white/80 rounded" />
                <div className="h-20 bg-white/80 rounded" />
                <div className="h-12 bg-white/80 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}