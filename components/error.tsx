// app/board/[boardId]/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BoardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Registrar el error en un servicio de telemetría si es necesario
    console.error("Error capturado en el tablero:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 max-w-md w-full text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          ⚠️
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Algo salió mal al cargar el tablero
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Ha ocurrido un problema al obtener los datos de las columnas o tarjetas.
          </p>
        </div>

        {error.message && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded border border-red-100 text-left font-mono overflow-x-auto">
            {error.message}
          </div>
        )}

        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Volver al Dashboard
          </Link>
          <button
            onClick={() => reset()}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
}