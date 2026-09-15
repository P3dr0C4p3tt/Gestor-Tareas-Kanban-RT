"use client";

import { useState } from "react";
import { createBoard } from "@/app/actions/board-actions";
import { useRouter } from "next/navigation";

export function CreateBoardDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createBoard(formData);
    setLoading(false);

    if (result.success && result.boardId) {
      setIsOpen(false);
      router.push(`/board/${result.boardId}`);
    } else {
      alert(result.error || "Error al crear el tablero");
    }
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        + Nuevo Tablero
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Crear nuevo tablero</h2>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del tablero
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Ej. Proyecto Kanban 2026"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Creando..." : "Crear tablero"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}