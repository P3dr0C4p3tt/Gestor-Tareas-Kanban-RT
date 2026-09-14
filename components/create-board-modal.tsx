"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBoard } from "@/app/actions/board-actions";

export function CreateBoardModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createBoard(formData);
    setLoading(false);

    if (result.success && result.boardId) {
      onClose();
      router.push(`/board/${result.boardId}`);
    } else {
      alert(result.error || "Error al crear el tablero");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-100 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-base font-bold text-gray-800">Crear nuevo tablero</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold"
          >
            ✕
          </button>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Título del tablero
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Ej. Proyecto Web, Lote Q3, Lanzamiento..."
              autoFocus
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded border"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear tablero"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}