// app/board/[boardId]/not-found.tsx
import Link from "next/link";

export default function BoardNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 max-w-md w-full text-center space-y-4">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          🔍
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">Tablero no encontrado</h2>
          <p className="text-xs text-gray-500 mt-1">
            El tablero que buscas no existe o no tienes los permisos necesarios para verlo.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-block px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Ir a mis tableros
          </Link>
        </div>
      </div>
    </div>
  );
}