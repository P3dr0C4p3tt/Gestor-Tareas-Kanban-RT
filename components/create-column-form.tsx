"use client";

import { useState } from "react";
import { createColumn } from "@/app/actions/column-actions";

export function CreateColumnForm({ boardId }: { boardId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const result = await createColumn(boardId, name);
    setLoading(false);

    if (result.success) {
      setName("");
      setIsOpen(false);
    } else {
      alert(result.error || "Error al crear la columna");
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-72 bg-gray-200/50 hover:bg-gray-200/80 rounded-lg p-3 text-sm font-medium text-gray-700 flex items-center justify-center border border-dashed border-gray-400 transition-colors shrink-0"
      >
        + Añadir otra columna
      </button>
    );
  }

  return (
    <div className="w-72 bg-gray-200/70 rounded-lg p-3 shrink-0 border border-gray-300">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la columna..."
          autoFocus
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creando..." : "Añadir columna"}
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
    </div>
  );
}