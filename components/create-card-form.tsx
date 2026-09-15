"use client";

import { useState } from "react";
import { createCard } from "@/app/actions/card-actions";

interface CreateCardFormProps {
  columnId: string;
  boardId: string;
}

export function CreateCardForm({ columnId, boardId }: CreateCardFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createCard(formData);
    setLoading(false);

    if (result.success) {
      setIsOpen(false);
    } else {
      alert(result.error || "Error al crear la tarjeta");
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-2 py-1.5 px-2 text-left text-xs font-medium text-gray-600 hover:bg-gray-300/60 rounded transition-colors flex items-center gap-1"
      >
        <span>+ Añadir tarjeta</span>
      </button>
    );
  }

  return (
    <form action={handleSubmit} className="mt-2 space-y-2">
      <textarea
        name="title"
        required
        autoFocus
        placeholder="Escribe un título para esta tarjeta..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={2}
      />
      <input type="hidden" name="columnId" value={columnId} />
      <input type="hidden" name="boardId" value={boardId} />

      <div className="flex items-center space-x-2">
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Añadir"}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}