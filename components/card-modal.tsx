"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateCardDetails } from "@/app/actions/card-actions";
import { deleteCard } from "@/app/actions/card-actions";

export interface CardData {
  id: string;
  title: string;
  description?: string | null;
  priority?: string;
  labelColor?: string | null;
  dueDate?: string | Date | null;
  order?: number;
  columnId?: string;
}

interface CardModalProps {
  card: CardData;
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
  onCardUpdated?: (updatedCard: CardData) => void;
}

export function CardModal({ card, boardId, isOpen, onClose }: CardModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const toastId = toast.loading("Guardando cambios...");

    const result = await updateCardDetails(formData);
    setLoading(false);

    if (result.success) {
      toast.success("Tarjeta actualizada correctamente", { id: toastId });
      onClose();
    } else {
      toast.error(result.error || "No se pudieron guardar los cambios", { id: toastId });
    }
  }

  async function handleDeleteCard() {
  if (!confirm("¿Seguro que deseas eliminar esta tarjeta?")) return;

  const toastId = toast.loading("Eliminando tarjeta...");

  const result = await deleteCard(card.id, boardId);

  if (result.success) {
    toast.success("Tarjeta eliminada", { id: toastId });
    onClose();
  } else {
    toast.error(result.error || "No se pudo eliminar la tarjeta", { id: toastId });
  }
}

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl border border-gray-100">
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="cardId" value={card.id} />
          <input type="hidden" name="boardId" value={boardId} />

          {/* Título de la tarjeta */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Título
            </label>
            <input
              type="text"
              name="title"
              defaultValue={card.title}
              required
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              defaultValue={card.description || ""}
              rows={3}
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prioridad y Fecha de Vencimiento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Prioridad */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Prioridad
                </label>
                <select
                  name="priority"
                  defaultValue={card.priority}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>

              {/* Etiqueta */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Etiqueta
                </label>
                <select
                  name="labelColor"
                  defaultValue={card.labelColor || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin etiqueta</option>
                  <option value="#ef4444">🔴 Rojo</option>
                  <option value="#f97316">🟠 Naranja</option>
                  <option value="#f59e0b">🟡 Amarillo</option>
                  <option value="#10b981">🟢 Verde</option>
                  <option value="#3b82f6">🔵 Azul</option>
                  <option value="#8b5cf6">🟣 Morado</option>
                </select>
              </div>

              {/* Fecha de Vencimiento */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Vencimiento
                </label>
                <input
                  type="date"
                  name="dueDate"
                  defaultValue={
                    card.dueDate
                      ? new Date(card.dueDate).toISOString().split("T")[0]
                      : ""
                  }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <button
              type="button"
              onClick={handleDeleteCard}
              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded border border-red-200 transition-colors"
            >
              🗑️ Eliminar Tarjeta
            </button>

            <div className="flex space-x-2">
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
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}